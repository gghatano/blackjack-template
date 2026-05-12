import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HistoryIcon from '@mui/icons-material/History';
import UndoIcon from '@mui/icons-material/Undo';
import EditIcon from '@mui/icons-material/Edit';
import CasinoIcon from '@mui/icons-material/Casino';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import confetti from 'canvas-confetti';

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
  onResetGame,
}) => {
  const theme = useTheme();
  const goldMain = theme.palette.casino.gold[600];
  const feltDark = theme.palette.casino.felt[900];

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [gameHistory, setGameHistory] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [usedWords, setUsedWords] = useState([]);
  const [gameTeams, setGameTeams] = useState(teams.map((t) => ({ ...t, isOut: false })));
  const [roundNumber, setRoundNumber] = useState(1);

  const [showScoreAnimation, setShowScoreAnimation] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [floatingDelta, setFloatingDelta] = useState(null); // { teamIndex, value }

  const [gameWinner, setGameWinner] = useState(null);
  const [showWinnerDisplay, setShowWinnerDisplay] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showTargetEdit, setShowTargetEdit] = useState(false);
  const [targetDraft, setTargetDraft] = useState(targetScore);
  const [historyOpen, setHistoryOpen] = useState(true);

  const [inputDisabled, setInputDisabled] = useState(false);
  const [columnHeaders, setColumnHeaders] = useState({ column1: '', column2: '' });

  const lastSnapshotRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchSheetData(dataUrl);
        setWordData(data.items);
        setColumnHeaders(data.headers);
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

  const fireWinnerConfetti = () => {
    const end = Date.now() + 1800;
    const colors = ['#d4af37', '#ffffff', '#e2c25a', '#13593b'];
    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  const checkForWinner = (teams) => {
    const remaining = teams.filter((t) => !t.isOut);
    if (remaining.length === 1) return remaining[0];
    if (remaining.length === 0) {
      // 全員バスト時：直近で最も高いスコアを暫定勝者として返す（既存仕様にはなかったが救済）
      return null;
    }
    return null;
  };

  const moveToNextTeam = (teams, fromIndex) => {
    let nextIndex = (fromIndex + 1) % teams.length;
    while (teams[nextIndex].isOut && teams.some((t) => !t.isOut)) {
      nextIndex = (nextIndex + 1) % teams.length;
      if (nextIndex === fromIndex) break;
    }
    if (nextIndex === 0 || nextIndex < fromIndex) {
      setRoundNumber((r) => r + 1);
    }
    setCurrentTeamIndex(nextIndex);
    setTimeout(() => setInputDisabled(false), 80);
  };

  const snapshot = () => {
    lastSnapshotRef.current = {
      gameTeams,
      usedWords,
      currentTeamIndex,
      roundNumber,
      gameHistory,
      gameWinner,
      showWinnerDisplay,
    };
  };

  const handleUndo = () => {
    const snap = lastSnapshotRef.current;
    if (!snap || inputDisabled || showScoreAnimation) return;
    setGameTeams(snap.gameTeams);
    setUsedWords(snap.usedWords);
    setCurrentTeamIndex(snap.currentTeamIndex);
    setRoundNumber(snap.roundNumber);
    setGameHistory(snap.gameHistory);
    setGameWinner(snap.gameWinner);
    setShowWinnerDisplay(snap.showWinnerDisplay);
    setSelectedWord(null);
    lastSnapshotRef.current = null;
  };

  const handleSelectWord = (word) => {
    if (inputDisabled || showScoreAnimation) return;
    if (!usedWords.includes(word.name)) {
      setSelectedWord(word);
    }
  };

  const handleSkip = () => {
    if (inputDisabled || showScoreAnimation) return;
    if (gameTeams[currentTeamIndex].isOut) return;
    snapshot();
    setInputDisabled(true);
    setSelectedWord(null);
    setGameHistory((prev) => [
      ...prev,
      {
        team: gameTeams[currentTeamIndex].name,
        teamIndex: currentTeamIndex,
        word: 'スキップ',
        wordValue: 0,
        newScore: gameTeams[currentTeamIndex].score,
        isOut: false,
        isSkip: true,
        round: roundNumber,
      },
    ]);
    setTimeout(() => moveToNextTeam(gameTeams, currentTeamIndex), 350);
  };

  const handleConfirmSelection = () => {
    if (!selectedWord || inputDisabled || showScoreAnimation) return;
    snapshot();
    setInputDisabled(true);

    const fromIndex = currentTeamIndex;
    const currentTeam = gameTeams[fromIndex];
    const newScore = currentTeam.score + selectedWord.value;
    const isOut = newScore > targetScore;

    const updatedTeams = [...gameTeams];
    updatedTeams[fromIndex] = { ...currentTeam, score: newScore, isOut };
    setGameTeams(updatedTeams);
    setUsedWords([...usedWords, selectedWord.name]);

    const newHistoryRecord = {
      team: currentTeam.name,
      teamIndex: fromIndex,
      word: selectedWord.name,
      wordValue: selectedWord.value,
      newScore,
      isOut,
      round: roundNumber,
    };

    setSelectedWord(null);
    setFloatingDelta({ teamIndex: fromIndex, value: selectedWord.value });
    setTimeout(() => setFloatingDelta(null), 1200);

    setAnimatedScore(currentTeam.score);
    setShowScoreAnimation(true);

    const startTs = performance.now();
    const duration = 700;
    const tick = (ts) => {
      const elapsed = ts - startTs;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = Math.round(currentTeam.score + (newScore - currentTeam.score) * eased);
      setAnimatedScore(v);
      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        finishAnimation();
      }
    };
    requestAnimationFrame(tick);

    const finishAnimation = () => {
      if (isOut) {
        const el = document.getElementById(`team-panel-${fromIndex}`);
        if (el) {
          el.classList.add('team-out-animation');
          setTimeout(() => el.classList.remove('team-out-animation'), 600);
        }
      }
      setGameHistory((prev) => [...prev, newHistoryRecord]);

      let winner = null;
      if (isOut || updatedTeams.every((t) => t.isOut || usedWords.length + 1 >= wordData.length)) {
        winner = checkForWinner(updatedTeams);
        if (winner) setGameWinner(winner);
      }

      setTimeout(() => {
        setShowScoreAnimation(false);
        if (winner) {
          setTimeout(() => {
            setShowWinnerDisplay(true);
            setInputDisabled(false);
            fireWinnerConfetti();
          }, 400);
        } else {
          setTimeout(() => moveToNextTeam(updatedTeams, fromIndex), 200);
        }
      }, 500);
    };
  };

  const handleTargetSave = () => {
    const v = parseInt(targetDraft, 10);
    if (!isNaN(v) && v > 0) setTargetScore(v);
    setShowTargetEdit(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress sx={{ color: goldMain }} />
          <Typography sx={{ color: 'rgba(255,255,255,0.85)' }}>データを読み込み中...</Typography>
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Paper sx={{ p: 3, maxWidth: 480, mx: 'auto' }}>
          <Typography color="error" gutterBottom>{error}</Typography>
          <Button onClick={onResetGame} variant="contained" color="primary">トップに戻る</Button>
        </Paper>
      </Box>
    );
  }

  const currentTeam = gameTeams[currentTeamIndex];
  const currentTeamColor = theme.palette.teamColors[currentTeamIndex % theme.palette.teamColors.length];
  const remainingCount = gameTeams.filter((t) => !t.isOut).length;

  return (
    <div className="game-shell">
      <div className="game-main">
        {/* ===== トップステータスバー ===== */}
        <Paper
          elevation={6}
          sx={{
            p: 2,
            background: `linear-gradient(180deg, ${theme.palette.casino.felt[700]} 0%, ${feltDark} 100%)`,
            border: `1px solid ${theme.palette.casino.gold[700]}`,
            color: '#fff',
            position: 'sticky',
            top: 0,
            zIndex: 5,
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <CasinoIcon sx={{ color: goldMain }} />
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 800 }}>
                Word BlackJack
              </Typography>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
              <Stack alignItems="center" spacing={0.25}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1 }}>
                  目標スコア
                </Typography>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Typography
                    variant="h5"
                    className="tnum"
                    sx={{ color: goldMain, fontWeight: 800, lineHeight: 1.1 }}
                  >
                    {targetScore.toLocaleString()}
                  </Typography>
                  <Tooltip title="目標スコアを変更">
                    <IconButton
                      size="small"
                      onClick={() => { setTargetDraft(targetScore); setShowTargetEdit(true); }}
                      sx={{ color: 'rgba(255,255,255,0.7)' }}
                    >
                      <EditIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>

              <Chip
                label={`Round ${roundNumber}`}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(212,175,55,0.4)' }}
              />
              <Chip
                label={`残り ${remainingCount} チーム`}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: '#fff' }}
              />
            </Stack>

            <Stack direction="row" spacing={1}>
              <Tooltip title={lastSnapshotRef.current ? '直前の手を取り消す' : '取り消せる手はありません'}>
                <span>
                  <IconButton
                    onClick={handleUndo}
                    disabled={!lastSnapshotRef.current || inputDisabled || showScoreAnimation}
                    sx={{ color: '#fff' }}
                  >
                    <UndoIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => setShowResetConfirm(true)}
                startIcon={<ArrowBackIosNewIcon />}
                sx={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}
              >
                トップ
              </Button>
            </Stack>
          </Stack>

          {/* 現在のターン大バナー */}
          {!showWinnerDisplay && currentTeam && (
            <Box
              className="turn-banner"
              key={`turn-${currentTeamIndex}-${roundNumber}`}
              sx={{
                mt: 1.5,
                p: 2,
                borderRadius: 2,
                background: `linear-gradient(90deg, ${currentTeamColor} 0%, ${currentTeamColor}cc 60%, ${currentTeamColor}55 100%)`,
                border: `2px solid ${currentTeamColor}`,
                boxShadow: `0 0 0 2px rgba(255,255,255,0.08) inset, 0 6px 18px ${currentTeamColor}66`,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    bgcolor: '#fff',
                    boxShadow: `0 0 12px #fff, 0 0 4px ${currentTeamColor}`,
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: '#fff',
                    textTransform: 'uppercase',
                    letterSpacing: '0.18em',
                    fontWeight: 800,
                    opacity: 0.9,
                  }}
                >
                  Your turn ▶
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    color: '#fff',
                    fontWeight: 900,
                    textShadow: '0 2px 0 rgba(0,0,0,0.45)',
                    letterSpacing: '0.02em',
                  }}
                >
                  {currentTeam.name}
                </Typography>
              </Stack>
            </Box>
          )}
        </Paper>

        {/* ===== 勝者表示 ===== */}
        {showWinnerDisplay && (
          <Paper
            className="winner-pop"
            elevation={8}
            sx={{
              p: 4,
              textAlign: 'center',
              background: `linear-gradient(180deg, ${theme.palette.casino.gold[400]} 0%, ${theme.palette.casino.gold[700]} 100%)`,
              border: `3px solid ${theme.palette.casino.gold[800]}`,
              color: feltDark,
            }}
          >
            <EmojiEventsIcon className="trophy-anim" sx={{ fontSize: 80, color: feltDark, mb: 1 }} />
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>
              WINNER
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
              {gameWinner?.name}
            </Typography>
            <Stack direction="row" spacing={3} justifyContent="center" sx={{ mb: 3 }}>
              <Stack alignItems="center">
                <Typography variant="caption" sx={{ opacity: 0.8 }}>最終スコア</Typography>
                <Typography variant="h5" className="tnum" sx={{ fontWeight: 800 }}>
                  {gameWinner?.score?.toLocaleString()}
                </Typography>
              </Stack>
              <Stack alignItems="center">
                <Typography variant="caption" sx={{ opacity: 0.8 }}>目標との差</Typography>
                <Typography variant="h5" className="tnum" sx={{ fontWeight: 800 }}>
                  {Math.abs((gameWinner?.score ?? 0) - targetScore).toLocaleString()}
                </Typography>
              </Stack>
            </Stack>
            <Button onClick={onResetGame} variant="contained" color="secondary" size="large">
              もう一回あそぶ
            </Button>
          </Paper>
        )}

        {/* ===== チームパネル ===== */}
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: '1fr',
              sm: gameTeams.length === 1 ? '1fr' : 'repeat(2, 1fr)',
              md: `repeat(${Math.min(gameTeams.length, 4)}, 1fr)`,
            },
          }}
        >
          {gameTeams.map((team, index) => (
            <TeamPanel
              key={index}
              id={`team-panel-${index}`}
              team={team}
              teamColor={theme.palette.teamColors[index % theme.palette.teamColors.length]}
              isActive={index === currentTeamIndex && !showWinnerDisplay}
              targetScore={targetScore}
              selectedWord={index === currentTeamIndex ? selectedWord : null}
              onConfirm={index === currentTeamIndex ? handleConfirmSelection : null}
              showAnimation={showScoreAnimation && index === currentTeamIndex}
              animatedScore={animatedScore}
              floatingDelta={floatingDelta && floatingDelta.teamIndex === index ? floatingDelta.value : null}
              disabled={inputDisabled || showScoreAnimation || showWinnerDisplay}
            />
          ))}
        </Box>

        {/* ===== 履歴 ===== */}
        <Paper sx={{ p: 2, bgcolor: 'rgba(255,248,230,0.96)' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1}>
              <HistoryIcon sx={{ color: 'secondary.main' }} />
              <Typography variant="h6" sx={{ color: 'secondary.dark' }}>
                履歴
              </Typography>
              <Chip label={`${gameHistory.length} 手`} size="small" />
            </Stack>
            <IconButton onClick={() => setHistoryOpen((v) => !v)}>
              {historyOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Stack>
          <Collapse in={historyOpen} timeout="auto">
            {gameHistory.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                まだ手が打たれていません
              </Typography>
            ) : (
              <TableContainer sx={{ mt: 1, maxHeight: 320 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>R</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>チーム</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{columnHeaders.column1 || '単語'}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>{columnHeaders.column2 || '値'}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>累計</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>結果</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {gameHistory.slice().reverse().map((record, idx) => {
                      const isLatest = idx === 0;
                      const tc = theme.palette.teamColors[(record.teamIndex ?? 0) % theme.palette.teamColors.length];
                      return (
                        <TableRow
                          key={gameHistory.length - 1 - idx}
                          className={isLatest ? 'latest-history-row' : ''}
                          sx={{ '& td': { fontWeight: isLatest ? 700 : 400 } }}
                        >
                          <TableCell>{record.round}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: tc }} />
                              {record.team}
                            </Stack>
                          </TableCell>
                          <TableCell>
                            {record.isSkip ? (
                              <Typography component="span" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                                スキップ
                              </Typography>
                            ) : (
                              record.word
                            )}
                          </TableCell>
                          <TableCell align="right" className="tnum">
                            {record.isSkip ? '—' : `+${record.wordValue.toLocaleString()}`}
                          </TableCell>
                          <TableCell align="right" className="tnum">{record.newScore.toLocaleString()}</TableCell>
                          <TableCell align="center">
                            {record.isOut ? (
                              <Chip label="BUST" size="small" color="error" sx={{ fontWeight: 800 }} />
                            ) : record.isSkip ? (
                              <Chip label="SKIP" size="small" variant="outlined" />
                            ) : (
                              <Chip label="OK" size="small" color="success" variant="outlined" />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Collapse>
        </Paper>
      </div>

      {/* ===== サイドカラム: 単語リスト ===== */}
      <aside className="game-side">
        <WordList
          words={wordData}
          usedWords={usedWords}
          selectedWord={selectedWord}
          onSelectWord={handleSelectWord}
          onSkip={handleSkip}
          disabled={inputDisabled || showScoreAnimation || showWinnerDisplay}
          column1Label={columnHeaders.column1 || '単語'}
        />
      </aside>

      {/* ===== モーダル: トップに戻る確認 ===== */}
      <Dialog open={showResetConfirm} onClose={() => setShowResetConfirm(false)}>
        <DialogTitle>ゲームを終了しますか？</DialogTitle>
        <DialogContent>
          <Typography>進行中のゲームの状態は失われます。</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResetConfirm(false)}>キャンセル</Button>
          <Button onClick={onResetGame} variant="contained" color="error">トップに戻る</Button>
        </DialogActions>
      </Dialog>

      {/* ===== モーダル: 目標スコア変更 ===== */}
      <Dialog open={showTargetEdit} onClose={() => setShowTargetEdit(false)}>
        <DialogTitle>目標スコアを変更</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            type="number"
            fullWidth
            value={targetDraft}
            onChange={(e) => setTargetDraft(e.target.value)}
            sx={{ mt: 1 }}
            InputProps={{ inputProps: { min: 1 } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTargetEdit(false)}>キャンセル</Button>
          <Button onClick={handleTargetSave} variant="contained" color="primary">変更する</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default GameScreen;
