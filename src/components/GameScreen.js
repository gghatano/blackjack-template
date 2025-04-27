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
  const [gameWinner, setGameWinner] = useState(null);
  const [showWinnerDisplay, setShowWinnerDisplay] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [activeTab, setActiveTab] = useState('words'); // モバイル用タブ切替

  // データ読み込み
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

  // モバイル用タブ切替ハンドラ
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // 勝者判定関数
  const checkForWinner = (teams) => {
    // 失格していないチーム数をカウント
    const remainingTeams = teams.filter(team => !team.isOut);
    
    // 残り1チームの場合は勝者確定
    if (remainingTeams.length === 1) {
      return remainingTeams[0];
    }
    
    return null;
  };

  // 次のチームへの移行関数
  const moveToNextTeam = (teams) => {
    console.log('Moving to next team');
    
    // 次のチームを決定
    let nextTeamIndex = (currentTeamIndex + 1) % teams.length;
    
    // 失格チームはスキップ
    while (teams[nextTeamIndex].isOut && teams.some(team => !team.isOut)) {
      nextTeamIndex = (nextTeamIndex + 1) % teams.length;
      if (nextTeamIndex === currentTeamIndex) break;
    }
    
    // ラウンド数の更新
    if (nextTeamIndex === 0 || nextTeamIndex < currentTeamIndex) {
      setRoundNumber(prevRound => prevRound + 1);
    }
    
    console.log('Setting next team to:', nextTeamIndex);
    setCurrentTeamIndex(nextTeamIndex);
    
    // 入力を再有効化
    setTimeout(() => {
      setInputDisabled(false);
      console.log('Input enabled for next team');
    }, 100);
  };

  // 単語選択ハンドラ
  const handleSelectWord = (word) => {
    if (inputDisabled || showScoreAnimation) {
      console.log('Cannot select word - input disabled or animation in progress');
      return;
    }
    
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

  // スキップハンドラ
  const handleSkip = () => {
    if (inputDisabled || showScoreAnimation) {
      console.log('Cannot skip - input disabled or animation in progress');
      return;
    }
    
    if (gameTeams[currentTeamIndex].isOut) return;
    
    // 入力無効化
    setInputDisabled(true);
    console.log('Input disabled for skip operation');
    
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
    
    // 遅延してから次のチームへ
    setTimeout(() => {
      moveToNextTeam(gameTeams);
    }, 500);
  };

  // 単語選択確定ハンドラ
  const handleConfirmSelection = () => {
    if (!selectedWord || inputDisabled || showScoreAnimation) {
      console.log('Cannot confirm - no selection, input disabled, or animation in progress');
      return;
    }
    
    // 入力無効化
    setInputDisabled(true);
    console.log('Input disabled for score calculation');
    
    // スコア計算
    const currentTeam = gameTeams[currentTeamIndex];
    const newScore = currentTeam.score + selectedWord.value;
    const isOut = newScore > targetScore;
    
    // チームスコア更新
    const updatedTeams = [...gameTeams];
    updatedTeams[currentTeamIndex] = {
      ...currentTeam, 
      score: newScore,
      isOut: isOut
    };
    setGameTeams(updatedTeams);
    
    // 履歴に追加
    setGameHistory([
      ...gameHistory,
      {
        team: currentTeam.name,
        word: selectedWord.name,
        wordValue: selectedWord.value,
        newScore,
        isOut,
        round: roundNumber
      }
    ]);
    
    // 使用済み単語に追加
    setUsedWords([...usedWords, selectedWord.name]);
    
    // 選択解除
    setSelectedWord(null);
    
    // アニメーション用のスコア設定
    setLastScore(currentTeam.score);
    setAnimatedScore(currentTeam.score);
    
    // アニメーション開始
    setShowScoreAnimation(true);
    
    // スコアアニメーション
    let animationStep = 0;
    const animationSteps = 10;
    const scoreDiff = newScore - currentTeam.score;
    const stepSize = Math.max(1, Math.ceil(scoreDiff / animationSteps));
    
    const animationTimer = setInterval(() => {
      setAnimatedScore(prev => {
        const next = prev + stepSize;
        return next >= newScore ? newScore : next;
      });
      
      animationStep++;
      if (animationStep >= animationSteps) {
        clearInterval(animationTimer);
        finishAnimation();
      }
    }, 50);
    
    // アニメーション完了後の処理
    const finishAnimation = () => {
      // 失格エフェクト
      if (isOut) {
        const teamPanel = document.getElementById(`team-panel-${currentTeamIndex}`);
        if (teamPanel) {
          teamPanel.classList.add('team-out-animation');
          setTimeout(() => {
            teamPanel.classList.remove('team-out-animation');
          }, 600);
        }
      }
      
      // 勝者判定
      let winner = null;
      if (isOut) {
        winner = checkForWinner(updatedTeams);
        if (winner) {
          setGameWinner(winner);
        }
      }
      
      // アニメーション完了後の遅延処理
      setTimeout(() => {
        setShowScoreAnimation(false);
        
        // 勝者がいる場合は表示
        if (winner) {
          setTimeout(() => {
            setShowWinnerDisplay(true);
            setInputDisabled(false);
            console.log('Game over - winner displayed');
          }, 500);
        } else {
          // 勝者がいない場合は次のチームへ
          setTimeout(() => {
            moveToNextTeam(updatedTeams);
          }, 300);
        }
      }, 700);
    };
  };

  // ターゲットスコア変更
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

  // 履歴テーブルコンポーネント - 再利用のため分離
  const HistoryTable = () => (
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
  );

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
          {showWinnerDisplay ? (
            <Paper elevation={4} sx={{ 
              bgcolor: 'background.highlight', 
              borderRadius: 3, 
              border: '2px solid #ffc107', 
              p: 3, 
              textAlign: 'center',
              boxShadow: '0 5px 20px rgba(255, 193, 7, 0.3)',
              mb: 3,
              animation: 'winnerDisplay 1s ease-in-out',
            }}>
              <Typography variant="h4" sx={{ color: 'warning.dark', fontWeight: 'bold', mb: 2 }}>
                <span style={{ animation: 'trophy 1.5s infinite', display: 'inline-block' }}>🏆</span> 勝者 <span style={{ animation: 'trophy 1.5s infinite 0.5s', display: 'inline-block' }}>🏆</span>
              </Typography>
              <Typography variant="h5" sx={{ color: 'primary.dark', fontWeight: 'bold' }}>
                {gameWinner?.name}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ mr: 2 }}>
                  最終スコア: <strong>{gameWinner?.score}</strong>
                </Typography>
                <Typography variant="body1">
                  目標との差: <strong>{Math.abs(gameWinner?.score - targetScore)}</strong>
                </Typography>
              </Box>
              <Button 
                variant="contained" 
                color="warning" 
                onClick={onResetGame}
                sx={{ mt: 3, minWidth: 200, py: 1 }}
              >
                ゲームを終了する
              </Button>
            </Paper>
          ) : (
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
          )}
          
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
          
          {/* デスクトップ表示用ゲーム履歴 */}
          <Box mt={4} className="desktop-history-container">
            <Typography variant="h6" gutterBottom sx={{ color: 'info.dark', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8px' }}>📋</span> ゲーム履歴
            </Typography>
            <HistoryTable />
          </Box>
          
          {/* モバイル向けタブ切り替え */}
          <div className="mobile-tabs">
            <div 
              className={`mobile-tab ${activeTab === 'words' ? 'active' : ''}`}
              onClick={() => handleTabChange('words')}
            >
              <span>📖 単語リスト</span>
            </div>
            <div 
              className={`mobile-tab ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => handleTabChange('history')}
            >
              <span>📋 ゲーム履歴</span>
            </div>
          </div>
          
          {/* モバイル用単語リスト（タブで表示・非表示切り替え） */}
          <div className={`mobile-tab-content ${activeTab !== 'words' ? 'hidden' : ''}`}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ color: 'warning.dark', fontWeight: 'bold', mb: 1 }}>
                単語を選んでください
              </Typography>
              <WordList 
                words={wordData} 
                usedWords={usedWords}
                selectedWord={selectedWord}
                onSelectWord={handleSelectWord}
                onSkip={handleSkip}
                disabled={inputDisabled || showScoreAnimation || showWinnerDisplay}
              />
            </Box>
          </div>
          
          {/* モバイル用ゲーム履歴（タブで表示・非表示切り替え） */}
          <div className={`mobile-tab-content ${activeTab !== 'history' ? 'hidden' : ''}`}>
            <Typography variant="subtitle1" sx={{ color: 'info.dark', fontWeight: 'bold', mb: 1 }}>
              ゲーム履歴
            </Typography>
            <HistoryTable />
          </div>
        </div>
        
        {/* デスクトップ表示用：右サイドの単語リスト */}
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
            disabled={inputDisabled || showScoreAnimation || showWinnerDisplay}
          />
        </div>
      </div>
    </Box>
  );
};

export default GameScreen;