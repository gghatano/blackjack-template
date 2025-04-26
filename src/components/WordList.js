import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

const WordList = ({ words, usedWords, selectedWord, onSelectWord }) => {
  return (
    <Box sx={{ 
      maxHeight: 'calc(100vh - 120px)', 
      overflow: 'auto',
      p: 1,
      bgcolor: 'background.lightOrange',
      borderRadius: 2,
      border: '1px solid #ffb74d'
    }}>
      {words.map((word, index) => {
        const isUsed = usedWords.includes(word.name);
        const isSelected = selectedWord && selectedWord.name === word.name;
        
        return (
          <Paper
            key={index}
            className={`word-item ${isUsed ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
            elevation={isSelected ? 3 : 1}
            onClick={() => !isUsed && onSelectWord(word)}
            sx={{
              mb: 1,
              p: 1.5,
              borderRadius: 2,
              cursor: isUsed ? 'not-allowed' : 'pointer',
              backgroundColor: isUsed 
                ? '#f5f5f5' 
                : isSelected 
                  ? theme => theme.palette.gameElements.wordItem
                  : 'white',
              color: isUsed ? '#aaa' : 'inherit',
              borderLeft: isSelected ? '4px solid #2196f3' : 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: isUsed 
                  ? '#f5f5f5' 
                  : isSelected 
                    ? theme => theme.palette.gameElements.wordItemHover
                    : '#fff3e0',
                transform: isUsed ? 'none' : 'translateX(5px)'
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