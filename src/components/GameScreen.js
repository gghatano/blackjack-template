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
  TableRow,
  Chip
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
  const [roundNumber, setRoundNumber] = useState(1);
  const [showScoreAnimation, setShowScoreAnimation] = useState(false);
  const [lastScore, setLastScore] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [scoreAnimationComplete, setScoreAnimationComplete] = useState(false);

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
      
      // アニメーション効果：選択時のフィードバック
      const wordElement = document.getElementById(`word-${word.name}`);
      if (wordElement) {
        wordElement.classList.add('word-selected-animation');
        setTimeout(() => {
          wordElement.classList.remove('word-selected-animation');
        }, 500);
      }
    }
  };

  const handleSkip = () => {
    if (gameTeams[currentTeamIndex].isOut) return;
    
    // ヒストリーに記録
    setGameHistory([
      ...gameHistory,
      {
        team: gameTeams[currentTeamIndex].name,
        word: 'スキップ',
        wordValue: 0,
        newScore: gameTeams[currentTeamIndex].score,
        isOut: false,
        isSkip: true
      }
    ]);
    
    // 選択をクリア
    setSelectedWord(null);
    
    // 次のチームを決定
    let nextTeamIndex = (currentTeamIndex + 1) % gameTeams.length;
    while (
      gameTeams[nextTeamIndex].isOut && 
      gameTeams.some(team => !team.isOut)
    ) {
      nextTeamIndex = (nextTeamIndex + 1) % gameTeams.length;
      if (nextTeamIndex === currentTeamIndex) break;
    }
    
    // スキップ表示のための等待時間
    const skipAnimationDuration = 500;
    
    setTimeout(() => {
      // ラウンド数の更新
      if (nextTeamIndex === 0 || nextTeamIndex < currentTeamIndex) {
        setRoundNumber(prevRound => prevRound + 1);
      }
      
      // チームの切り替え
      setCurrentTeamIndex(nextTeamIndex);
    }, skipAnimationDuration);
  };

  const handleConfirmSelection = () => {
    if (!selectedWord) return;
    
    const currentTeam = gameTeams[currentTeamIndex];
    const newScore = currentTeam.score + selectedWord.value;
    const isOut = newScore > targetScore;
    
    // アニメーション用に前回のスコアを保存
    setLastScore(currentTeam.score);
    setAnimatedScore(currentTeam.score);
    setScoreAnimationComplete(false); // アニメーション開始時にリセット
    
    // Update team score
    const updatedTeams = [...gameTeams];
    updatedTeams[currentTeamIndex] = {
      ...currentTeam,
      score: newScore,
      isOut
    };
    setGameTeams(updatedTeams);
    
    // スコアアニメーションの開始
    setShowScoreAnimation(true);
    
    // Add to history
    setGameHistory([
      ...gameHistory,
      {
        team: currentTeam.name,
        word: selectedWord.name,
        wordValue: selectedWord.value,
        newScore: newScore,
        isOut,
        round: roundNumber
      }
    ]);
    
    // Mark word as used
    setUsedWords([...usedWords, selectedWord.name]);
    
    // Clear selection
    setSelectedWord(null);
    
    // アニメーションのためのインターバル
    const scoreInterval = setInterval(() => {
      setAnimatedScore(prevScore => {
        const nextScore = prevScore + Math.ceil((newScore - prevScore) / 10);
        if (nextScore >= newScore) {
          clearInterval(scoreInterval);
          // アニメーション完了を通知
          setScoreAnimationComplete(true);
          return newScore;
        }
        return nextScore;
      });
    }, 50);
    
    // アニメーション完了をチェックするインターバル
    const checkInterval = setInterval(() => {
      if (scoreAnimationComplete) {
        clearInterval(checkInterval);
        
        // 失格時のアニメーション効果（スコアアニメーション完了後）
        if (isOut) {
          const teamPanel = document.getElementById(`team-panel-${currentTeamIndex}`);
          if (teamPanel) {
            teamPanel.classList.add('team-out-animation');
            setTimeout(() => {
              teamPanel.classList.remove('team-out-animation');
            }, 1000);
          }
        }
        
        // アニメーション終了処理
        setTimeout(() => {
          setShowScoreAnimation(false);
          
          // 次のチームへの移行を遅延
          setTimeout(() => {
            // 次のチームを決定
            let nextTeamIndex = (currentTeamIndex + 1) % gameTeams.length;
            while (
              updatedTeams[nextTeamIndex].isOut && 
              updatedTeams.some(team => !team.isOut)
            ) {
              nextTeamIndex = (nextTeamIndex + 1) % gameTeams.length;
              if (nextTeamIndex === currentTeamIndex) break;
            }
            
            // ラウンド数の更新
            if (nextTeamIndex === 0 || nextTeamIndex < currentTeamIndex) {
              setRoundNumber(prevRound => prevRound + 1);
            }
            
            // チームの切り替え
            setCurrentTeamIndex(nextTeamIndex);
          }, 500);
        }, 1000);
      }
    }, 100);
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
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="h5" component="span" sx={{ color: 'success.dark', fontWeight: 'bold' }}>
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
            
            <Box mt={2} display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip label={`ラウンド: ${roundNumber}`} color="primary" size="small" sx={{ fontWeight: 'bold' }} />
              </Typography>
              <Typography variant="body2">
                <span>ターン: <strong>{gameTeams[currentTeamIndex].name}</strong></span>
              </Typography>
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
                  id={`team-panel-${index}`}
                  team={team}
                  isActive={index === currentTeamIndex}
                  targetScore={targetScore}
                  selectedWord={index === currentTeamIndex ? selectedWord : null}
                  onConfirm={index === currentTeamIndex ? handleConfirmSelection : null}
                  showAnimation={showScoreAnimation && index === currentTeamIndex}
                  animatedScore={animatedScore}
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
                      <TableCell>
                        {record.isSkip ? 
                          <span style={{ color: '#ff9800', fontStyle: 'italic' }}>スキップ</span> : 
                          record.word
                        }
                      </TableCell>
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
            onSkip={handleSkip}
          />
        </div>
      </div>
    </Box>
  );
};

export default GameScreen;