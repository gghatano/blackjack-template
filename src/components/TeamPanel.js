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
        opacity: team.isOut ? 0.7 : 1
      }}
    >
      <Typography variant="h6">{team.name}</Typography>
      
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
        <Typography>
          現在のスコア: <strong>{team.score}</strong>
        </Typography>
        <Typography>
          残り: <strong>{team.isOut ? '失格' : remainingToTarget}</strong>
        </Typography>
      </Box>
      
      {isActive && !team.isOut && (
        <Box mt={2}>
          {selectedWord ? (
            <>
              <Typography variant="body2" gutterBottom>
                選択中: <strong>{selectedWord.name}</strong> 
                (値: {selectedWord.value})
              </Typography>
              <Typography variant="body2" gutterBottom>
                新しいスコア: <strong>{team.score + selectedWord.value}</strong> 
                ({team.score + selectedWord.value > targetScore ? '失格' : 'OK'})
              </Typography>
              <Button 
                variant="contained" 
                color={team.score + selectedWord.value > targetScore ? 'error' : 'primary'}
                onClick={onConfirm}
                fullWidth
                sx={{ mt: 1 }}
              >
                確定する
              </Button>
            </>
          ) : (
            <Typography variant="body2" color="textSecondary">
              右側のリストから単語を選択してください
            </Typography>
          )}
        </Box>
      )}
      
      {team.isOut && (
        <Typography variant="body2" color="error" mt={2}>
          目標スコアを超えました！
        </Typography>
      )}
    </Paper>
  );
};

export default TeamPanel;