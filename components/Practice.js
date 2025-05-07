import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";

import { Button, Card, Input, Loading, Page, Progress, Tabs, Text, Textarea, useToasts } from '@geist-ui/core'
import { ArrowRight, HelpCircle, Plus } from "@geist-ui/icons";
import { useEffect, useState } from "react";
import ai from "@/lib/ai";
import { keyEventsQuestions } from "@/lib/questionLibrary";
import { useSync } from "@/lib/sync";
import useMedia from "@/lib/media";
import Question from "./Question";



export default function Practice({ name, questionBank }) {
    const { setToast } = useToasts()

    const { displayUnit, setSavedQuestions } = useSync();
    const [question, setQuestion] = useState(null);
    const [completedQuestions, setCompletedQuestions] = useState([]);
    const [stats, setStats] = useState({
        correct: 0,
        partial: 0,
        incorrect: 0,
    });


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

        const availableQuestions = questionBank.filter(potentialQuestion => {
            if (completedQuestions.includes(potentialQuestion.question)) return false;
            if (unit == "all") return true;
            const unitFilter = unit == "1/2" ? 1 : +unit;

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

        const prompt = `
A student was given an AP US History question: "${question.question}".

The student answered "${studentAnswer}".

Please assess the answer and provide feedback directed at the student. Make sure to be polite—this isn't an exam and we want to help them learn.

You MUST (ABSOLUTELY MUST) respond in JSON format (NO BACKTICKS) with the following fields:
  "status" (one of the following:
    "incorrect" – the answer is factually inaccurate or shows little understanding of the topic
    "partial" – the answer is factually accurate, but it's either too short or shows potentially harmful learning gaps
    "correct" – the answer is factually accurate and shows moderate understanding of the topic (1 or 2 sentences is sufficient)
  ),
  "feedback" (a string with feedback on the answer- if they ask for an explanation, don't return this field),
  "review" (a brief review of the topic discussed in the question in 3 sentences or less. directly explain it and include relevant details)
  
Do not include any other text or explanation. The JSON should look like this: { "status": "correct", "feedback": "...", "review": "..." }`;

        const response = await ai(prompt);
        const json = JSON.parse(response);

        setQuestion(question => {
            question[json.status] = true;
            question.feedback = json.feedback;
            question.answer = studentAnswer;
            question.review = json.review;
            return question;
        });

        setStats(stats => {
            return {
                ...stats,
                [json.status]: stats[json.status] + 1,
            };
        });

        setState("answer");

    }

    const { sm } = useMedia();


    return (
        <>
            <div>
                <Text h2 mb={0} mt={0}>APUSH<em>.pro</em> {name}</Text>
                <Text h3 mt={0} mb={3} style={{
                    color: "#555",
                }}>{displayUnit || "All Units"}</Text>


                {question && <Question question={question} onExplain={() => {
                    setAnswer("Please explain this for me");
                    checkAnswer("Please explain this for me");
                }} loading={state == "loadingAnswer"} onSave={() => {
                    setSavedQuestions(questions => {
                        if (questions.find(q => q.question == question.question)) return questions;
                        return [...questions, question];
                    });
                    setToast({
                        text: "Saved to your study list",
                    })
                }} startedLoadingAt={stateUpdatedAt} />}


                <div style={{
                    position: "fixed",
                    bottom: "0px",
                    width: sm ? "calc(100% - 6rem)" : "calc(100% - 2rem)",
                    maxWidth: "800px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    padding: "1rem",
                    paddingBottom: "0.5rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "white",
                    boxShadow: "0px 0px 25px 31px rgba(255,255,255,1)",
                    zIndex: "100",

                }}>
                    <Textarea value={answer} onChange={e => setAnswer(e.target.value)} width="100%" scale={4 / 3} placeholder="Your answer" disabled={state != "question"} onKeyDown={e => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            checkAnswer();
                        }
                    }} style={{
                        width: "100%"
                    }}></Textarea>
                    <Text small mt={"4px"} style={{
                        width: "800px",
                        maxWidth: "100%",
                        textAlign: "left",
                        opacity: "0.8",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "start",
                        alignItems: "center",
                        gap: "0.5rem",
                    }}>
                        <Text type="success" span>{stats.correct} correct</Text> •
                        <Text type="warning" span>{stats.partial} partial</Text> •
                        <Text type="error" span>{stats.incorrect} incorrect</Text>
                    </Text>
                    {state == "answer" ? <Button auto onClick={nextQuestion} icon={<ArrowRight />} type="success-light" style={{
                        position: "absolute",
                        right: "max(calc(50% - 400px + 1rem), 2rem)",
                        top: "43%",
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

