import Head from 'next/head';
import { useState } from 'react';
import { Button, Grid, CircularProgress, Modal, Box, Paper, IconButton, Tooltip } from '@mui/material';
import TriviaScreen from '../components/TriviaScreen';
import axios from 'axios';
import InfoIcon from '@mui/icons-material/Info';

const BASE_URL = "http://127.0.0.1:5000/play/";


export default function Home() {

  function playClick() {
    document.getElementById("button-click").play()
  }

  function playTheme() {
    const audio = document.getElementById("theme-song");
    audio.volume = 0.2;
    audio.play()
  }

  function stopTheme() {
    const audio = document.getElementById("theme-song");
    audio.pause();
    audio.currentTime = 0;    
  }
  
  function playGenSound() {
    document.getElementById("gen-sound").play()
  }

  const [trivia, setTrivia] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [difficulty, setDifficulty] = useState("normal");
  const [amount, setAmount] = useState("10");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const reset = () => {
    playClick();
    stopTheme();
    setTrivia(null);
  }
  const generate = () => {
    playClick();
    if (text !== '') {
      setLoading(true);
      axios.get(BASE_URL + text + "/" + difficulty + "/" + amount).
      then(({data}) => {
        playGenSound();
        setTimeout(() => {
          playTheme();
          if (typeof data === 'string') {
            try {
              setTrivia(JSON.parse(data.slice(data.indexOf('['), data.lastIndexOf(']') + 1)))
            }
            catch (error) {
              alert("Who let him cook!? Chat GPT did not like your input or glitched out! Please try again.");
              stopTheme();
            }
          }
          else{
            setTrivia(data);
          }
          setLoading(false);
          setText("");
        }, 2000);
      }).catch((error) => {
        alert("Server poblems...")
        setLoading(false);
        stopTheme();
      });
    }
  }

  const handleKeyDown = (e) => {
    if (e.keyCode == 13 && !loading) {
      generate();
    }
  }

  const typeTheme = (e) => {
    setText(e.target.value);
  }

  return (
    <div>
      <Head>
        <title>Trivia GPT</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <audio
          src="/music/button.mp3" 
          id = "button-click"/>
          <audio
          src="/music/correct.mp3" 
          id = "correct-sound"/>
          <audio
          src="/music/wrong.mp3" 
          id = "wrong-sound"/>
          <audio loop
          src="/music/theme.mp3" 
          id = "theme-song"/>
          <audio
          src="/music/generated.mp3" 
          id = "gen-sound"/>
        {trivia === null && 
        <Grid spacing = {5} style ={{position: 'absolute', top: '30%'}} container justifyContent = "space-evenly" alignItems = "center">
          <Grid item xs = {12} align = 'center'> 
            <h1 className = "title" align = "center">Trivia GPT</h1>
          </Grid>
          <Grid align = "center" className = "fade-in" item xs = {12}>
            <Grid container  rowSpacing = {5} alignItems = "center" >
              <Grid align = "center" item xs = {112}>
                <input maxLength = "50" value = {text} onKeyDown={handleKeyDown} placeholder='Enter a theme...' type = "text" className = 'gen-bar' onChange = {typeTheme} />
              </Grid>
              <Grid item xs = {12}>
                <div>
                  <Tooltip title = "Difficulty">
                    <select
                      value={difficulty}
                      label="Difficulty"
                      className="dropdown"
                      onChange={(e) => setDifficulty(e.target.value)}
                    >
                      <option value={"easy"}>Easy</option>
                      <option value={"normal"}>Normal</option>
                      <option value={"difficult"}>Difficult</option>
                    </select>
                  </Tooltip>
                  <Tooltip title = "Amount of Questions">
                    <select
                      value={amount}
                      label="Amount"
                      onChange={(e) => setAmount(e.target.value)}
                      className="dropdown"
                    >
                      <option value={"5"}>5</option>
                      <option value={"10"}>10</option>
                      <option value={"15"}>15</option>
                      <option value={"20"}>20</option>
                    </select>
                  </Tooltip>
                </div>
              </Grid>
              <Grid align = "center" item xs = {12}> 
                <Button disabled = {loading} className = "gen-button" variant = "contained" onClick = {generate}>
                  {loading? "Generating": "Generate"}
                  &nbsp;
                  {loading && <CircularProgress color = "inherit" size = {30}/>}
                  </Button>
              </Grid>
            </Grid> 
          </Grid>
          <Grid className = "fade-in" align = "center" item xs = {12}>
            {loading? 
            <p className = "info-text">
              Let him cook...
            </p>
            :
            <p className = "info-text">
              Enter the theme, difficulty, and number of questions for your trivia game and click generate to play. 
              All questions and answers are generated using Chat GPT!
            </p>}
          </Grid>
          <Grid item xs = {12} className = "fade-in" align = "center">
              
          </Grid>
        </Grid>
        }
        {trivia && 
            <TriviaScreen  trivia={trivia} reset = {reset}/>
        }
        <div>
        {!trivia && 
        <IconButton  style = {{position: "absolute", top: "95%", left: "95%"}}variant = "contained" onClick = {handleOpen}>
          <InfoIcon />
        </IconButton>
        }
          <Modal
            open={open}
            onClose={handleClose}
          >
            <Box component = {Paper} className = "info-box">
              <Grid justifyContent = "center" alignItems = "center" container>
                <Grid item xs ={12}>
                  <h1 className = "info-title">
                    Assets
                  </h1>
                </Grid>
                <Grid item xs = {12}>
                  <h1 className = "citation-title">Fonts</h1>
                  <ul className = "citation-list">
                    <li>
                      Silkcreen font courtesy of <a href = "http://www.kottke.org/">Jason Kottke</a>
                    </li>
                    <li>
                      LilitaOne font
                    </li>
                  </ul>
                </Grid>
                <Grid item xs = {12}>
                  <h1 className = "citation-title">Music</h1>
                  <ul className = "citation-list">
                    <li>Wrong, Correct, and Generation sounds from <a href="https://pixabay.com/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=47985">Pixabay</a></li>
                    <li>"Catch It" by <a href="https://pixabay.com/users/coma-media-24399569/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=117676">Coma-Media</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=117676">Pixabay</a> </li>
                    <li>"Badly" and "Despair" by <a href="https://pixabay.com/users/sergequadrado-24990007/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=122527">SergeQuadrado</a> from <a href="https://pixabay.com/music//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=122527">Pixabay</a></li>
                    <li>"Keep the Groove" and "Get Funky!"<a href="https://pixabay.com/users/muzaproduction-24990238/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=20921">Muzaproduction</a> from <a href="https://pixabay.com/music//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=20921">Pixabay</a></li>
                  </ul>
                </Grid>
                <Grid item xs = {12}>
                  <h1 className = "citation-title">Reaction images from <a href = "https://bluemoji.io/">Bluemoji</a></h1>
                </Grid>
              </Grid>
            </Box>
          </Modal>
      </div>
      </main>

      <footer>

      </footer>
    </div>
  )
}
