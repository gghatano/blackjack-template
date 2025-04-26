import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Paper, 
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { fetchSheetData } from '../utils/sheetUtils';
import WordList from './WordList';
import TeamPanel from './TeamPanel';

const GameScreen = ({ 
  teams, 
  dataUrl, 
  wordData,
  setWordData,
  targetScore,
  setTargetScore,
  onResetGame 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [gameHistory, setGameHistory] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [usedWords, setUsedWords] = useState([]);
  const [gameTeams, setGameTeams] = useState(teams.map(team => ({ ...team, isOut: false })));

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchSheetData(dataUrl);
        setWordData(data);
        setError(null);
      } catch (err) {
        console.error('Error loading sheet data:', err);
        setError('スプレッドシートデータの読み込みに失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dataUrl, setWordData]);

  const handleSelectWord = (word) => {
    if (!usedWords.includes(word.name)) {
      setSelectedWord(word);
    }
  };

  const handleConfirmSelection = () => {
    if (!selectedWord) return;
    
    const currentTeam = gameTeams[currentTeamIndex];
    const newScore = currentTeam.score + selectedWord.value;
    const isOut = newScore > targetScore;
    
    // Update team score
    const updatedTeams = [...gameTeams];
    updatedTeams[currentTeamIndex] = {
      ...currentTeam,
      score: newScore,
      isOut
    };
    setGameTeams(updatedTeams);
    
    // Add to history
    setGameHistory([
      ...gameHistory,
      {
        team: currentTeam.name,
        word: selectedWord.name,
        wordValue: selectedWord.value,
        newScore: newScore,
        isOut
      }
    ]);
    
    // Mark word as used
    setUsedWords([...usedWords, selectedWord.name]);
    
    // Clear selection
    setSelectedWord(null);
    
    // Move to next team (skip teams that are already out)
    let nextTeamIndex = (currentTeamIndex + 1) % gameTeams.length;
    while (
      updatedTeams[nextTeamIndex].isOut && 
      // Only move if there's at least one team still in the game
      updatedTeams.some(team => !team.isOut)
    ) {
      nextTeamIndex = (nextTeamIndex + 1) % gameTeams.length;
      
      // If we've gone full circle, stay on current team
      if (nextTeamIndex === currentTeamIndex) {
        break;
      }
    }
    setCurrentTeamIndex(nextTeamIndex);
  };

  const handleTargetScoreChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setTargetScore(value);
    }
  };

  if (loading) {
    return <Typography>データを読み込み中...</Typography>;
  }

  if (error) {
    return (
      <Box>
        <Typography color="error">{error}</Typography>
        <Button onClick={onResetGame}>戻る</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      <Button 
        variant="outlined"
        color="secondary" 
        onClick={onResetGame}
        sx={{ mb: 2, borderRadius: 2 }}
        startIcon={<span>⬅️</span>}
      >
        トップに戻る
      </Button>
      
      <div className="grid-container">
        <div className="game-area">
          <Paper className="target-score" elevation={3} sx={{ bgcolor: 'background.lightGreen', borderRadius: 2, border: '1px solid #81c784' }}>
            <Box display="flex" alignItems="center">
              <Typography variant="h5" component="span" sx={{ mr: 2, color: 'success.dark', fontWeight: 'bold' }}>
                目標スコア:
              </Typography>
              <TextField
                type="number"
                value={targetScore}
                onChange={handleTargetScoreChange}
                variant="outlined"
                size="small"
                sx={{ width: 150 }}
              />
            </Box>
          </Paper>
          
          <Grid container spacing={2}>
            {gameTeams.map((team, index) => (
              <Grid item 
                xs={12} 
                sm={gameTeams.length <= 2 ? 6 : 12} 
                md={gameTeams.length <= 2 ? 6 : gameTeams.length === 3 ? 4 : 6} 
                lg={gameTeams.length === 4 ? 3 : gameTeams.length === 3 ? 4 : 6}
                key={index}
              >
                <TeamPanel
                  team={team}
                  isActive={index === currentTeamIndex}
                  targetScore={targetScore}
                  selectedWord={index === currentTeamIndex ? selectedWord : null}
                  onConfirm={index === currentTeamIndex ? handleConfirmSelection : null}
                />
              </Grid>
            ))}
          </Grid>
          
          <Box mt={4}>
            <Typography variant="h6" gutterBottom sx={{ color: 'info.dark', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8px' }}>📋</span> ゲーム履歴
            </Typography>
            <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Table size="small" className="history-table">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'background.lightPurple' }}>
                    <TableCell>チーム</TableCell>
                    <TableCell>選択した単語</TableCell>
                    <TableCell align="right">単語の値</TableCell>
                    <TableCell align="right">新しいスコア</TableCell>
                    <TableCell>結果</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {gameHistory.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>{record.team}</TableCell>
                      <TableCell>{record.word}</TableCell>
                      <TableCell align="right">{record.wordValue}</TableCell>
                      <TableCell align="right">{record.newScore}</TableCell>
                      <TableCell align="right">{record.isOut ? 
                        <span style={{ color: 'error.main', fontWeight: 'bold' }}>失格</span> : 
                        <span style={{ color: 'success.main' }}>OK</span>
                      }</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </div>
        
        <div className="word-list-area">
          <Typography variant="h6" gutterBottom sx={{ color: 'warning.dark', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px' }}>📖</span> 単語リスト
          </Typography>
          <WordList 
            words={wordData} 
            usedWords={usedWords}
            selectedWord={selectedWord}
            onSelectWord={handleSelectWord}
          />
        </div>
      </div>
    </Box>
  );
};

export default GameScreen;