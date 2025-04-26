import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

const WordList = ({ words, usedWords, selectedWord, onSelectWord }) => {
  return (
    <Box sx={{ maxHeight: 'calc(100vh - 120px)', overflow: 'auto' }}>
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
              borderRadius: 1,
              cursor: isUsed ? 'not-allowed' : 'pointer',
              backgroundColor: isUsed 
                ? '#f5f5f5' 
                : isSelected 
                  ? '#e3f2fd' 
                  : 'white',
              color: isUsed ? '#aaa' : 'inherit',
              '&:hover': {
                backgroundColor: isUsed 
                  ? '#f5f5f5' 
                  : isSelected 
                    ? '#bbdefb' 
                    : '#f0f0f0'
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