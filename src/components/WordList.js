import React from 'react';
import { Paper, Typography, Box, Button } from '@mui/material';

const WordList = ({ words, usedWords, selectedWord, onSelectWord, onSkip, disabled }) => {
  return (
    <Box sx={{ 
      maxHeight: 'calc(100vh - 120px)', 
      overflow: 'auto',
      p: 1,
      bgcolor: 'background.lightOrange',
      borderRadius: 2,
      border: '1px solid #ffb74d',
      opacity: disabled ? 0.7 : 1,
      transition: 'opacity 0.3s ease'
    }}>
      <Button
        variant="outlined"
        color="warning"
        fullWidth
        onClick={onSkip}
        disabled={disabled}
        sx={{
          mb: 2,
          fontWeight: 'bold',
          borderRadius: 2,
          border: '2px solid #ff9800',
          '&:hover': {
            backgroundColor: disabled ? 'transparent' : '#fff3e0',
            borderColor: disabled ? '#ff9800' : '#f57c00',
          },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 1
        }}
      >
        <span style={{ marginRight: '8px' }}>⏭️</span>
        スキップ
      </Button>
      {words.map((word, index) => {
        const isUsed = usedWords.includes(word.name);
        const isSelected = selectedWord && selectedWord.name === word.name;
        
        return (
          <Paper
            key={index}
            id={`word-${word.name}`}
            className={`word-item ${isUsed ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
            elevation={isSelected ? 3 : 1}
            onClick={() => !isUsed && !disabled && onSelectWord(word)}
            sx={{
              mb: 1,
              p: 1.5,
              borderRadius: 2,
              cursor: isUsed || disabled ? 'not-allowed' : 'pointer',
              backgroundColor: isUsed || disabled
                ? '#f5f5f5' 
                : isSelected 
                  ? theme => theme.palette.gameElements.wordItem
                  : 'white',
              color: isUsed || disabled ? '#aaa' : 'inherit',
              opacity: disabled ? 0.7 : 1,
              borderLeft: isSelected ? '4px solid #2196f3' : 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: isUsed || disabled
                  ? '#f5f5f5' 
                  : isSelected 
                    ? theme => theme.palette.gameElements.wordItemHover
                    : '#fff3e0',
                transform: isUsed || disabled ? 'none' : 'translateX(5px)'
              }
            }}
          >
            <Typography variant="body1">{word.name}</Typography>
          </Paper>
        );
      })}
    </Box>
  );
};

export default WordList;