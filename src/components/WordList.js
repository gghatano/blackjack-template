import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CheckIcon from '@mui/icons-material/Check';

const SORT_OPTIONS = [
  { value: 'default', label: 'デフォルト順' },
  { value: 'name', label: '名前順' },
];

const WordList = ({
  words,
  usedWords,
  selectedWord,
  onSelectWord,
  onSkip,
  disabled,
  column1Label,
}) => {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [hideUsed, setHideUsed] = useState(false);

  const filtered = useMemo(() => {
    let list = [...words.map((w, i) => ({ ...w, _origIndex: i }))];
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((w) => w.name.toLowerCase().includes(q));
    }
    if (hideUsed) {
      list = list.filter((w) => !usedWords.includes(w.name));
    }
    if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name, 'ja'));
    }
    return list;
  }, [words, query, sortBy, hideUsed, usedWords]);

  const usedCount = usedWords.length;
  const totalCount = words.length;

  return (
    <Paper
      elevation={4}
      sx={{
        p: 1.5,
        bgcolor: '#fff8e6',
        border: `1px solid ${theme.palette.casino.gold[700]}`,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <MenuBookIcon sx={{ color: 'secondary.main' }} />
        <Typography variant="h6" sx={{ color: 'secondary.dark' }}>
          {column1Label} リスト
        </Typography>
        <Typography variant="caption" sx={{ ml: 'auto', color: 'text.secondary' }} className="tnum">
          {usedCount} / {totalCount}
        </Typography>
      </Stack>

      <Button
        variant="contained"
        color="secondary"
        fullWidth
        startIcon={<SkipNextIcon />}
        onClick={onSkip}
        disabled={disabled}
        sx={{ mb: 1.5 }}
      >
        ターンをスキップ
      </Button>

      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <TextField
          placeholder="検索"
          size="small"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: query ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setQuery('')}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />
        <Select
          size="small"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          sx={{ minWidth: 120 }}
        >
          {SORT_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </Stack>

      <ToggleButtonGroup
        size="small"
        exclusive
        value={hideUsed ? 'unused' : 'all'}
        onChange={(_, v) => v && setHideUsed(v === 'unused')}
        sx={{ mb: 1, alignSelf: 'flex-start' }}
      >
        <ToggleButton value="all">すべて</ToggleButton>
        <ToggleButton value="unused">未使用のみ</ToggleButton>
      </ToggleButtonGroup>

      <Box sx={{ flex: 1, overflowY: 'auto', minHeight: 0, pr: 0.5 }}>
        {filtered.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
            {query ? '一致する単語がありません' : '単語がありません'}
          </Typography>
        ) : (
          <Stack spacing={0.75}>
            {filtered.map((word) => {
              const isUsed = usedWords.includes(word.name);
              const isSelected = selectedWord && selectedWord.name === word.name;
              const clickable = !isUsed && !disabled;
              return (
                <Paper
                  key={word._origIndex}
                  id={`word-${word.name}`}
                  elevation={isSelected ? 4 : 0}
                  onClick={() => clickable && onSelectWord(word)}
                  sx={{
                    p: 1,
                    pl: 1.25,
                    cursor: clickable ? 'pointer' : 'not-allowed',
                    border: '1px solid',
                    borderColor: isSelected
                      ? theme.palette.casino.gold[700]
                      : isUsed
                        ? 'rgba(0,0,0,0.08)'
                        : 'rgba(0,0,0,0.12)',
                    bgcolor: isSelected
                      ? 'rgba(212,175,55,0.18)'
                      : isUsed
                        ? 'rgba(0,0,0,0.04)'
                        : '#fff',
                    color: isUsed ? 'text.disabled' : 'text.primary',
                    transition: 'all 0.15s ease',
                    borderLeft: isSelected
                      ? `4px solid ${theme.palette.casino.gold[700]}`
                      : '4px solid transparent',
                    '&:hover': clickable
                      ? {
                          bgcolor: isSelected ? 'rgba(212,175,55,0.25)' : 'rgba(212,175,55,0.10)',
                          borderColor: theme.palette.casino.gold[700],
                          transform: 'translateX(3px)',
                        }
                      : {},
                  }}
                >
                  <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                    <Stack direction="row" alignItems="center" spacing={0.75} sx={{ minWidth: 0 }}>
                      {isUsed && <CheckIcon fontSize="small" sx={{ color: 'text.disabled' }} />}
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: isSelected ? 700 : 500,
                          textDecoration: isUsed ? 'line-through' : 'none',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {word.name}
                      </Typography>
                    </Stack>
                    {isUsed && (
                      <Typography
                        variant="caption"
                        className="tnum"
                        sx={{
                          fontWeight: 700,
                          color: 'text.secondary',
                          bgcolor: 'rgba(0,0,0,0.06)',
                          px: 0.75,
                          py: 0.25,
                          borderRadius: 0.75,
                          flexShrink: 0,
                        }}
                      >
                        {word.value.toLocaleString()}
                      </Typography>
                    )}
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        )}
      </Box>
    </Paper>
  );
};

export default WordList;
