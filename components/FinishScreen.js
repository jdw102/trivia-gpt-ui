import { Grid, Button, Slide, Tooltip } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import data from '../public/config/finishscreen.json';
import { useState } from 'react';


const FinishScreen = ({correct, wrong, reset}) => {
    const audio = document.getElementById("theme-song");
    const [score, setScore] = useState(false);
    const [button, setButton] = useState(false);
    const [message, setMessage] = useState(false);

    setTimeout(() => setScore(true), 1000);
    setTimeout(() => {
        setMessage(true);
        playSong();
    }, 2000);
    setTimeout(() => setButton(true), 5000);

    function playSong() {
        const audio = document.getElementById("finish-song");
        if (audio) {
            document.getElementById("finish-song").play();
        }
    }

    function stopSong() {
        const audio = document.getElementById("finish-song");
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    }

    function buttonClick() {
        stopSong();
        reset();
    }

    audio.pause();
    audio.currentTime = 0;  
    let result = null;
    let corr = parseInt(correct) / (parseInt(correct) + parseInt(wrong));
    console.log(corr);
    if (corr >= 0 && corr <= 0.3) {
        result = data.find((d) => d.id == 1);
    }
    else if  (corr > 0.3 && corr <= 0.7) {
        result = data.find((d) => d.id == 2);
    }
    else if (corr > 0.7 && corr <= 0.85) {
        result = data.find((d) => d.id == 3);
    }
    else{
        result = data.find((d) => d.id == 4);
    }

    console.log(result);
    return (
        <Grid className = "finish-screen"container alignItems = "center" justifyContent="center">
            <Grid item xs = {12} align = "center">
                <h1 className = "finished-title">Finished!</h1>
            </Grid>
            <Grid item xs = {12} align = "center">
                <h1 className = "finished-subtitle">Here's how you did...</h1>
            </Grid>
            <Grid item xs = {12}>
                <Slide direction = "up" in = {score} timeout={{enter: 1000}}>
                    <Grid spacing = {20} container justifyContent = "center">
                        <Grid item xs = {6} align = "right">
                            <div className = "score-board" id = "correct">
                                {correct}
                            </div>
                            <p className = "correct-subtitle">
                                Correct
                            </p>
                        </Grid>
                        <Grid item xs = {6}>
                            <div className = "score-board" id = "wrong">
                                {wrong}
                            </div>
                            <p className = "wrong-subtitle">
                                Wrong
                            </p>
                        </Grid>
                    </Grid>
                </Slide>
            </Grid>
            <Grid item xs = {12} align = "center">
                <Slide direction = "up" in = {message} timeout={{enter: 3000}}>
                    <h1 className = "finished-message">
                        {result.message}
                    </h1>
                </Slide>
            </Grid>
            <Grid item xs = {12} align = "center">
                <Slide direction = "up" in = {button} timeout={{enter: 3000}}>
                    <Tooltip title = "Generate a New Game">
                        <Button className = "go-back-button" variant = "contained" onClick = {buttonClick} >
                            <ReplayIcon fontSize = "large"/>
                        </Button>
                    </Tooltip>
                </Slide>
            </Grid>
            <audio src={`/music/${result.music}`} 
            id = "finish-song"/>
        </Grid>
    )
}

export default FinishScreen; 