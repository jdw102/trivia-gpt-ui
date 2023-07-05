import { Grid, Card, CardContent, Button, Paper, CardActionArea, Divider, LinearProgress, Tooltip } from '@mui/material';
import React, {useState, useEffect} from 'react';
import Zoom from '@mui/material/Zoom';
import FinishScreen from './FinishScreen';
import ReplayIcon from '@mui/icons-material/Replay';


export default function TriviaScreen({trivia, style, reset}) {
    const checkImages = ["ok", "thumbsup", "happy"];
    const xImages = ["annoyed", "dumb", "what"];  

    const [question, setQuestion] = useState(0);
    const answer = trivia[question].answer;

    const [timer, setTimer] = useState(0);
    const [finished, setFinished] = useState(false);
    const [correct, setCorrect] = useState(0);
    const [wrong, setWrong] = useState(0);
    const [triggerCheck, setTriggerCheck] = useState(false);
    const [triggerX, setTriggerX] = useState(false);
    const [disable, setDisable] = useState(false);
    const [selected, setSelected] = useState(null);
    const [show, setShow] = useState(false);  
    const [checkImage, setCheckImage] = useState(`/images/${checkImages[0]}.png`);
    const [xImage, setXImage] = useState(`/images/${xImages[0]}.png`);
    

    function playCorrect() {
        document.getElementById("correct-sound").play()

    }

    function playWrong() {
        document.getElementById("wrong-sound").play()
    }   

    const nextQuestion = () => {
        setQuestion((prev) => {
            if (prev == trivia.length - 1) {
                setFinished(true);
                return 0;
            }
            else {
                return prev + 1;
            }
        })
    }
    
    useEffect(() => {
        if (!finished && trivia[0].question != "") {
            setTimer(0);
            const time = setInterval(() => {
                setTimer((oldProgress) => {
                    if (oldProgress == 100) {
                        setWrong(old => {return old + 1;})
                        setTriggerX(true);
                        setDisable(true);
                        setShow(true);
                        playWrong();
                        return 0;
                    }
                    return Math.min(oldProgress + 1, 100);
                });
                }, 100);
            return () => {
                clearInterval(time);
            };
        }
  }, [triggerCheck, triggerX]);

  useEffect(() => {
    setTimeout(() => {
        if (triggerCheck) {
            setTriggerCheck(false);
            setCheckImage(`/images/${checkImages[Math.floor(Math.random()*checkImages.length)]}.png`);
        }
        if (triggerX) {
            setTriggerX(false);
            setXImage(`/images/${xImages[Math.floor(Math.random()*xImages.length)]}.png`);
        }
        if (triggerCheck || triggerX) {
            nextQuestion();
            setSelected(false);
            setShow(false);
            setDisable(false);
        }
    }, 1000);
    }, [triggerCheck, triggerX]);

    const handleEnter = (text, index) => {
        setDisable(true);
        if (text  === answer) {
            setTriggerCheck(true);
            playCorrect();
            setCorrect(old => {return old + 1;})
        }
        else {
            setWrong(old => {return old + 1;})
            playWrong();
            setTriggerX(true);
        }
        setSelected(index);
        setShow(true);
    }
    if (finished) {
        return <FinishScreen wrong = {wrong} correct = {correct} reset = {reset}/>
    }
    else {
        return (
            <Grid className = "trivia-screen" style = {style} container justifyContent = "center" spacing = {4}>
                <Grid item xs = {12}>
                    <Grid spacing = {10} container justifyContent = "center">
                        <Grid item xs = {6} align = "right">
                            <Tooltip title = "Correct">
                                <div className = "score-board" id = "correct">
                                    {correct}
                                </div>
                            </Tooltip>
                        </Grid>
                        <Grid item xs = {6}>
                            <Tooltip title = "Wrong">
                                <div className = "score-board" id = "wrong">
                                    {wrong}
                                </div>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs = {12}>
                        <h3 className = "question-number">Question {question + 1} of {trivia.length}</h3>
                        <Divider />
                </Grid>
                <Grid align = "center" key = {trivia[question].key} item xs = {12}>
                    <h1 className = 'question-text'>{trivia[question].question}</h1>
                </Grid>
                <Grid item xs = {12}>
                    <Grid container spacing = {3} >
                        {trivia[question].choices != null && trivia[question].choices.map((choice, index) => {
                        return (
                            <Grid className = "choice-box"  key = {index} align = "center" item xs = {12} md = {6}>
                                    <Card className = {`choice-${index}`} 
                                    style = {show && choice === answer? selected === index? {backgroundColor: "#60e85c"}: {backgroundColor: "#e85c5c"}: {}}
                                    raised component = {Paper}>
                                        <CardActionArea onClick={() => handleEnter(choice, index)} disabled = {disable} >
                                            <CardContent>
                                                <h1 className = "choice-text">{choice}</h1>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                            </Grid>
                        )
                    })}
                    </Grid>
                </Grid>
                <Grid item xs = {12}className = "progress-box">
                    <LinearProgress color = "error" className = "progress-bar" variant = "determinate" value = {timer} />
                </Grid>
                <Zoom in={triggerCheck} ><img className = "reaction-img" src = {checkImage} alt = "Good emoji" /></Zoom>
                <Zoom in={triggerX}><img className = "reaction-img" src = {xImage} alt = "Bad emoji" /></Zoom>
                <Tooltip title = "Enter a New Theme">
                    <Button style = {{position: "absolute", top: "5%", left: '3%'}} className = "go-back-button" variant = "contained" onClick = {reset}>
                        <ReplayIcon fontSize = "large"/>
                    </Button>
                </Tooltip>
            </Grid> )
    }
}
