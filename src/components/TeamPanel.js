import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  LinearProgress,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const TeamPanel = ({
  id,
  team,
  teamColor,
  isActive,
  targetScore,
  selectedWord,
  onConfirm,
  showAnimation,
  animatedScore,
  floatingDelta,
  disabled,
}) => {
  const theme = useTheme();
  const [scoreClass, setScoreClass] = useState('');
  const [scoreDisplay, setScoreDisplay] = useState(team.score);
  const [showOutMessage, setShowOutMessage] = useState(team.isOut);

  useEffect(() => {
    if (showAnimation) {
      setScoreDisplay(animatedScore);
      setScoreClass('score-change-animation');
      if (team.isOut && animatedScore < targetScore) {
        setShowOutMessage(false);
      }
    } else {
      setScoreDisplay(team.score);
      if (scoreClass) {
        setTimeout(() => setScoreClass(''), 200);
      }
      setShowOutMessage(team.isOut);
    }
  }, [showAnimation, animatedScore, team.score, team.isOut, targetScore, scoreClass]);

  // 進捗 (0..1+)
  const progress = Math.max(0, Math.min(1, scoreDisplay / targetScore));
  const overshootRatio = scoreDisplay > targetScore ? 1 : progress;

  // 段階的な色
  let progressColor = theme.palette.casino.felt[700];
  if (progress >= 0.95) progressColor = theme.palette.error.main;
  else if (progress >= 0.85) progressColor = theme.palette.casino.gold[700];
  else if (progress >= 0.6) progressColor = theme.palette.casino.gold[800];

  const remaining = targetScore - scoreDisplay;

  return (
    <Paper
      id={id}
      elevation={isActive ? 10 : 2}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        p: 2,
        pt: isActive ? 0 : 2,
        borderRadius: 2,
        // 背景は常にクリーム — 可読性最優先
        bgcolor: showOutMessage ? '#efe9d9' : '#fffaee',
        border: isActive ? `3px solid ${teamColor}` : '1px solid rgba(0,0,0,0.08)',
        opacity: showOutMessage ? 0.85 : 1,
        transition: 'border-color 0.25s ease, transform 0.25s ease, box-shadow 0.4s ease',
        transform: isActive ? 'translateY(-2px) scale(1.01)' : 'none',
        // アクティブ時のみ外側にチームカラーの光輪
        boxShadow: isActive
          ? `0 0 0 3px ${teamColor}55, 0 14px 28px rgba(0,0,0,0.35)`
          : undefined,
        // 上部のチームカラー帯
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: isActive ? 12 : 6,
          background: `linear-gradient(90deg, ${teamColor}, ${teamColor}cc)`,
        },
      }}
    >
      {/* アクティブ時の YOUR TURN バナー（パネル幅いっぱい） */}
      {isActive && !showOutMessage && (
        <Box
          sx={{
            mx: -2,
            mt: '12px',
            mb: 1.5,
            py: 0.75,
            px: 2,
            background: teamColor,
            color: '#fff',
            fontWeight: 800,
            letterSpacing: '0.12em',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textShadow: '0 1px 2px rgba(0,0,0,0.4)',
          }}
        >
          <span>▶ YOUR TURN</span>
          <span style={{ fontSize: '0.75rem', opacity: 0.95 }}>あなたの番です</span>
        </Box>
      )}

      <Box sx={{ pt: isActive ? 0 : 0.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: isActive ? 16 : 12,
                height: isActive ? 16 : 12,
                borderRadius: '50%',
                bgcolor: teamColor,
                boxShadow: isActive ? `0 0 12px ${teamColor}` : 'none',
              }}
            />
            <Typography
              variant={isActive ? 'h5' : 'h6'}
              sx={{
                fontWeight: 800,
                color: isActive ? teamColor : 'text.primary',
                textShadow: isActive ? '0 1px 0 rgba(255,255,255,0.6)' : 'none',
              }}
            >
              {team.name}
            </Typography>
          </Stack>
        </Stack>

        {/* スコア表示 */}
        <Box sx={{ mt: 1.5, position: 'relative' }}>
          <Stack direction="row" alignItems="baseline" justifyContent="space-between">
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>スコア</Typography>
              <Typography
                variant="h3"
                className={`tnum ${scoreClass}`}
                sx={{
                  fontWeight: 800,
                  color: showOutMessage ? theme.palette.error.dark : theme.palette.casino.felt[800],
                  lineHeight: 1.1,
                }}
              >
                {scoreDisplay.toLocaleString()}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {showOutMessage ? '結果' : '残り'}
              </Typography>
              <Typography
                variant="h6"
                className="tnum"
                sx={{
                  fontWeight: 700,
                  color: showOutMessage ? theme.palette.error.main : remaining < targetScore * 0.1 ? theme.palette.error.main : theme.palette.success.dark,
                }}
              >
                {showOutMessage ? 'BUST' : remaining.toLocaleString()}
              </Typography>
            </Box>
          </Stack>

          {/* 進捗バー */}
          <Box sx={{ mt: 1.5, position: 'relative' }}>
            <LinearProgress
              variant="determinate"
              value={overshootRatio * 100}
              sx={{
                height: 10,
                borderRadius: 5,
                bgcolor: 'rgba(0,0,0,0.08)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: progressColor,
                  transition: 'transform 0.4s ease, background-color 0.4s ease',
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{ display: 'block', mt: 0.5, textAlign: 'right', color: 'text.secondary' }}
              className="tnum"
            >
              {Math.round(progress * 100)}% / {targetScore.toLocaleString()}
            </Typography>
          </Box>

          {/* フローティング差分 +XX */}
          {floatingDelta != null && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 8,
                color: theme.palette.casino.gold[800],
                fontWeight: 800,
                fontSize: '1.4rem',
                animation: 'fadeIn 0.3s ease-out, floatUp 1.1s ease-out forwards',
                '@keyframes floatUp': {
                  '0%': { transform: 'translateY(0)', opacity: 1 },
                  '100%': { transform: 'translateY(-30px)', opacity: 0 },
                },
              }}
              className="tnum"
            >
              +{floatingDelta.toLocaleString()}
            </Box>
          )}
        </Box>

        {/* 選択中ワード／確定ボタン */}
        {isActive && !showOutMessage && (
          <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, bgcolor: 'rgba(212,175,55,0.10)', border: '1px dashed rgba(212,175,55,0.45)' }}>
            {selectedWord ? (
              <>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  選択中
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  {selectedWord.name}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={onConfirm}
                  disabled={disabled}
                  startIcon={<CheckCircleIcon />}
                >
                  この手で確定
                </Button>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                右の単語リストから1つ選んでください
              </Typography>
            )}
          </Box>
        )}

        {showOutMessage && (
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2, p: 1, borderRadius: 1, bgcolor: 'rgba(198,40,40,0.08)' }}>
            <WarningAmberIcon color="error" />
            <Typography variant="body2" color="error" sx={{ fontWeight: 700 }}>
              目標スコアを超えました
            </Typography>
          </Stack>
        )}
      </Box>

      {/* BUSTスタンプ */}
      {showOutMessage && (
        <Box
          className="bust-stamp"
          sx={{
            position: 'absolute',
            top: '55%',
            left: '50%',
            pointerEvents: 'none',
            color: theme.palette.error.main,
            border: `4px solid ${theme.palette.error.main}`,
            borderRadius: 1,
            px: 2,
            py: 0.5,
            fontWeight: 900,
            fontSize: '2rem',
            letterSpacing: '0.15em',
            opacity: 0.7,
            background: 'rgba(255,255,255,0.0)',
            textShadow: '0 0 6px rgba(198,40,40,0.3)',
          }}
        >
          BUST
        </Box>
      )}
    </Paper>
  );
};

export default TeamPanel;
