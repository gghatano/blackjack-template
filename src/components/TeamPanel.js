import React from 'react';
import { Paper, Typography, Button, Box } from '@mui/material';

const TeamPanel = ({ team, isActive, targetScore, selectedWord, onConfirm }) => {
  const remainingToTarget = targetScore - team.score;
  
  return (
    <Paper 
      elevation={isActive ? 3 : 1} 
      sx={{
        p: 2,
        border: isActive ? '2px solid #2196f3' : '1px solid #ddd',
        backgroundColor: team.isOut ? '#f5f5f5' : 'white',
        opacity: team.isOut ? 0.7 : 1,
        borderRadius: 2,
        boxShadow: isActive 
          ? '0 4px 12px rgba(33, 150, 243, 0.2)' 
          : 'none',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        '&::after': isActive ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '4px',
          backgroundColor: 'primary.main',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px'
        } : {}
      }}
    >
      <Typography variant="h6" sx={{
        color: isActive ? 'primary.dark' : 'text.primary',
        fontWeight: isActive ? 'bold' : 'medium',
        display: 'flex',
        alignItems: 'center',
        '&::before': isActive ? {
          content: '"\u25B6"',
          marginRight: '8px',
          fontSize: '0.8rem',
          color: 'primary.main'
        } : {}
      }}>
        {team.name}
      </Typography>
      
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={1} bgcolor={team.isOut ? 'inherit' : 'background.default'} p={1} borderRadius={1}>
        <Typography>
          現在のスコア: <strong style={{ color: '#2196f3' }}>{team.score}</strong>
        </Typography>
        <Typography>
          残り: <strong style={{ color: team.isOut ? '#f44336' : '#4caf50' }}>{team.isOut ? '失格' : remainingToTarget}</strong>
        </Typography>
      </Box>
      
      {isActive && !team.isOut && (
        <Box mt={2} p={1.5} bgcolor="background.lightPurple" borderRadius={2}>
          {selectedWord ? (
            <>
              <Typography variant="body2" gutterBottom>
                選択中: <strong>{selectedWord.name}</strong>
              </Typography>
              <Typography variant="body2" gutterBottom>
                選択した単語の得点は確定後に表示されます
              </Typography>
              <Button 
                variant="contained"
                color="primary"
                onClick={onConfirm}
                fullWidth
                sx={{ 
                  mt: 1,
                  py: 1,
                  boxShadow: '0 4px 10px rgba(33, 150, 243, 0.3)',
                  '&:hover': {
                    boxShadow: '0 6px 12px rgba(33, 150, 243, 0.4)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.2s'
                }}
              >
                確定する
              </Button>
            </>
          ) : (
            <Typography variant="body2" color="textSecondary">
              <span className="desktop-only">右側のリストから単語を選択してください</span>
              <span className="mobile-only">下のリストから単語を選択してください</span>
            </Typography>
          )}
        </Box>
      )}
      
      {team.isOut && (
        <Typography variant="body2" color="error" mt={2} sx={{ 
          p: 1, 
          bgcolor: '#ffebee', 
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          fontWeight: 'medium'
        }}>
          <span style={{ marginRight: '8px' }}>⚠️</span> 目標スコアを超えました！
        </Typography>
      )}
    </Paper>
  );
};

export default TeamPanel;