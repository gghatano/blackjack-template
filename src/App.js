import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [teams, setTeams] = useState([]);
  const [dataUrl, setDataUrl] = useState('https://docs.google.com/spreadsheets/d/1Y-gSB3luEaQ8YVCWtBIxZ-xdAurTzlpDuwQ3Y7pRjww/edit?gid=0#gid=0');
  const [wordData, setWordData] = useState([]);
  const [targetScore, setTargetScore] = useState(90000);

  const handleStartGame = (teamData, url, score) => {
    setTeams(teamData);
    setDataUrl(url || dataUrl);
    if (score) setTargetScore(score);
    setGameStarted(true);
  };

  const handleResetGame = () => {
    setGameStarted(false);
    setTeams([]);
    setWordData([]);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="game-container" style={{ width: '100%', maxWidth: '100%' }}>
        {!gameStarted ? (
          <StartScreen onStartGame={handleStartGame} defaultUrl={dataUrl} />
        ) : (
          <GameScreen 
            teams={teams} 
            dataUrl={dataUrl} 
            wordData={wordData}
            setWordData={setWordData}
            targetScore={targetScore}
            setTargetScore={setTargetScore}
            onResetGame={handleResetGame}
          />
        )}
      </div>
    </ThemeProvider>
  );
}
