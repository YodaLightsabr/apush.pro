import useMedia from "@/lib/media";
import { HelpCircle, Plus } from "@geist-ui/icons";
import { useEffect, useState } from "react";

const { Card, Text, Progress, Button } = require("@geist-ui/core");


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

export default function Question({ question, onExplain, onSave, loading, startedLoadingAt }) {
    const { sm } = useMedia();
  
    return (
      <Card style={{
        display: "flex",
        padding: "0.5rem",
        flexDirection: "column",
        width: "1000px",
        maxWidth: "100%",
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
            gridTemplateColumns: sm ? (question.feedback && question.review ? "1fr 1fr" : "1fr") : "1fr",
  
            gap: "1rem",
          }}>
            {question.feedback ? <div>
              <Text h5 margin={0} marginTop={2}>Feedback</Text>
              <Text margin={0} marginTop={1 / 2} marginBottom={sm ? 2 : 1}>{question.feedback || "No feedback provided"}</Text>
  
            </div> : null}
            {question.review ? <div>
              <Text h5 margin={0} marginTop={sm ? 2 : 0}>Review</Text>
              <Text margin={0} marginTop={1 / 2} marginBottom={2}>{question.review || "No review provided"}</Text>
            </div> : null}
  
          </div>
  
  
        </>}
  
        <Card.Footer style={{
          padding: "16px 16px 8px 16px",
          display: "flex",
          gap: "1rem",
          flexWrap: sm ? undefined : "wrap",
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