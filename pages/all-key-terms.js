import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";

import { Button, Card, Input, Loading, Page, Progress, Tabs, Text, Textarea } from '@geist-ui/core'
import { ArrowRight, HelpCircle, Plus } from "@geist-ui/icons";
import { useEffect, useState } from "react";
import ai from "@/lib/ai";
import { keyEventsQuestions } from "@/lib/questionLibrary";
import { useSync } from "@/lib/sync";

function Question({ question, onExplain, onSave, loading, startedLoadingAt }) {
  return (
    <Card style={{
      display: "flex",
      padding: "0.5rem",
      flexDirection: "column",
      width: "1000px",
      margin: "0 auto",
      textAlign: "left",
      borderColor: question.incorrect ? "red" : question.correct ? "blue" : question.partial ? "orange" : undefined,
    }}>
      <div style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "1rem",
      }}>
        <Text h4 margin={0}>All Key Terms</Text>
        <Text h4 margin={0} type="secondary">Question {question.number}</Text>
      </div>
      <Text py={1}>{question.question}</Text>
      {(question.answer || question.feedback) && <><Text h5 margin={0}>Your Answer</Text>
            <Text blockquote margin={0} marginTop={1 / 2} padding={3 / 4} style={{
              fontStyle: "italic",
            }}>{question.answer || "No answer provided"}</Text></>}

      {(question.answer || question.feedback || question.review) && <>
        <div style={{
          display: "grid",
          gridTemplateColumns: (question.feedback && question.review ? "1fr 1fr" : "1fr"),
          gap: "1rem",
        }}>
          {question.feedback ? <div>
            <Text h5 margin={0} marginTop={2}>Feedback</Text>
            <Text margin={0} marginTop={1 / 2} marginBottom={2}>{question.feedback || "No feedback provided"}</Text>

          </div> : null}
          {question.review ? <div>
            <Text h5 margin={0} marginTop={2}>Review</Text>
            <Text margin={0} marginTop={1 / 2} marginBottom={2}>{question.review || "No review provided"}</Text>
          </div> : null}

        </div>


      </>}

      <Card.Footer style={{
        padding: "16px 16px 8px 16px",
        display: "flex",
        gap: "1rem",
      }}>
        <Button scale={1 / 2} icon={<HelpCircle />} auto onClick={onExplain} disabled={loading || question.answer}>Explain Answer</Button>
        <Button scale={1 / 2} icon={<Plus />} auto onClick={onSave}>Save to Study List</Button>

        <div style={{ flexGrow: 1 }}>
          {loading ? <IndefiniteProgress startedAt={startedLoadingAt} style={{
            marginLeft: "auto",
            marginRight: "auto",
            width: "100%",
          }} /> : null}
        </div>
        {question.correct && <Text h5 type="success">Correct</Text>}
        {question.incorrect && <Text h5 type="error">Incorrect</Text>}
        {question.partial && <Text h5 type="warning">Partial</Text>}
      </Card.Footer>
    </Card>

  );
}

function IndefiniteProgress({ startedAt, style }) {
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const x = elapsed / 1000;
      setCurrentProgress(1 - (0.5) ** (elapsed / 1000));
      setCurrentProgress(0.9 - (0.3) * (1 / 2) ** x - (0.6) * (1 / 9) ** x);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={style}>
      <Progress value={currentProgress * 100} style={{
        animation: "0.2s all",
      }} />
    </div>
  )
}

export default function Home() {
  const { unit } = useSync();
  const [question, setQuestion] = useState(null);
  const [completedQuestions, setCompletedQuestions] = useState([]);


  const [state, setState_raw] = useState("loading");
  const [stateUpdatedAt, setStateUpdatedAt] = useState(0);
  const setState = (newState) => {
    setState_raw(newState);
    setStateUpdatedAt(Date.now());
  }

  const [answer, setAnswer] = useState("");



  const nextQuestion = () => {
    if (question?.question) {
      setCompletedQuestions(completedQuestions => {
        return [...completedQuestions, question.question];
      });
    }

    setState("loading");
    setAnswer("");

    const unit = localStorage.getItem("unit");

    const availableQuestions = keyEventsQuestions.filter(potentialQuestion => {
      if (completedQuestions.includes(potentialQuestion.question)) return false;
      const unitFilter = unit == "1/2" ? 1 : +unit;
      if (unitFilter == "all") return true;
      return potentialQuestion.unit == unitFilter;
    })

    const nextQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    const questionText = nextQuestion.questions[Math.floor(Math.random() * nextQuestion.questions.length)];

    setQuestion(currentQuestion => {
      return {
        number: (currentQuestion?.number || 0) + 1,
        question: questionText,
        unit: nextQuestion.unit,
      }
    });
    setState("question");
  }

  useEffect(() => {
    nextQuestion();
  }, []);


  const checkAnswer = async (studentAnswer = answer) => {
    setState("loadingAnswer");

    const prompt = `A student was given an AP US History question: "${question.question}". The student answered "${studentAnswer}". Please assess the answer and provide feedback directed at the student. Make sure to be polite—this isn't an exam and we want to help them learn. You MUST (ABSOLUTELY MUST) respond in JSON format (NO BACKTICKS) with the following fields: "status" (either "correct", "incorrect", or "partial") and "feedback" (a string with feedback on the answer- if they ask for an explanation, don't return this field). Do not include any other text or explanation. The JSON should look like this: { "status": "correct", "feedback": "..." }`;

    const response = await ai(prompt);
    const json = JSON.parse(response);

    let review = null;

    if (json.status != "correct") {
      const reviewResponse = await ai([
        { role: "user", content: prompt },
        { role: "assistant", content: response },
        { role: "user", content: "Thank you. Now, I need you to provide a brief review for that student who got the question incorrect. Point them in the right direction in no more than 3 sentences. Don't provide them with resources: directly explain the event / key term in a way that helps prepare them for the exam. Don't frame it as a way to answer the question correctly– just explain it with any relevant details. Respond in the following format (JSON, NO BACKTICKS): \"review\" (a string with review info)" },
      ]);

      review = JSON.parse(reviewResponse).review;
    }

    setQuestion(question => {
      question[json.status] = true;
      question.feedback = json.feedback;
      question.answer = studentAnswer;
      question.review = review;
      return question;
    });

    setState("answer");

  }


  return (
    <>
      <Head>
        <title>APUSH.pro</title>
        <meta name="description" content="Study APUSH & get a 5 on Friday" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Text h2 mb={0} mt={0}>APUSH<em>.pro</em> Key Terms Practice</Text>
        <Text h3 mt={0} mb={3} style={{
          color: "#555",
        }}>AP US History Study Guide</Text>


        {question && <Question question={question} onExplain={() => {
          setAnswer("Please explain this for me");
          checkAnswer("Please explain this for me");
        }} loading={state == "loadingAnswer"} startedLoadingAt={stateUpdatedAt} />}
        

        <div style={{
          position: "fixed",
          bottom: "20px",
          width: "calc(100% - 6rem)",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "1rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          boxShadow: "0px 0px 25px 31px rgba(255,255,255,1)",
          zIndex: "100",

        }}>
          <Textarea value={answer} onChange={e => setAnswer(e.target.value)} width="800px" scale={4 / 3} placeholder="Your answer" disabled={state != "question"} onKeyDown={e => {
            if (e.key === "Enter") {
              e.preventDefault();
              checkAnswer();
            }
          }}></Textarea>
          {state == "answer" ? <Button auto onClick={nextQuestion} icon={<ArrowRight />} type="success-light" style={{
            position: "absolute",
            right: "max(calc(50% - 400px + 1rem), 2rem)",
            top: "50%",
            transform: "translateY(-50%)",
          }}>Next Question</Button> : null}
        </div>

        <div style={{
          height: "200px",
          width: "100%",
        }}></div>

      </div>
    </>
  );
}
