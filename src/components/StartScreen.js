import React, { useState } from 'react';
import { Button, TextField, Typography, Box, Paper, Grid, Slider, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const StartScreen = ({ onStartGame, defaultUrl }) => {
  const [teamCount, setTeamCount] = useState(2);
  const [teams, setTeams] = useState([
    { name: 'チーム1', score: 0 },
    { name: 'チーム2', score: 0 },
  ]);
  const [dataUrl, setDataUrl] = useState(defaultUrl || '');

  const handleTeamNameChange = (index, value) => {
    const newTeams = [...teams];
    newTeams[index] = { ...newTeams[index], name: value };
    setTeams(newTeams);
  };

  const handleTeamCountChange = (e) => {
    const count = parseInt(e.target.value, 10);
    if (count >= 1 && count <= 4) {
      setTeamCount(count);
      
      // Adjust teams array based on new count
      if (count > teams.length) {
        // Add new teams
        const newTeams = [...teams];
        for (let i = teams.length; i < count; i++) {
          newTeams.push({ name: `チーム${i+1}`, score: 0 });
        }
        setTeams(newTeams);
      } else if (count < teams.length) {
        // Remove extra teams
        setTeams(teams.slice(0, count));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onStartGame(teams, dataUrl);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          単語スコアゲーム
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="team-count-label">参加チーム数</InputLabel>
                <Select
                  labelId="team-count-label"
                  value={teamCount}
                  label="参加チーム数"
                  onChange={(e) => handleTeamCountChange(e)}
                >
                  <MenuItem value={1}>1チーム</MenuItem>
                  <MenuItem value={2}>2チーム</MenuItem>
                  <MenuItem value={3}>3チーム</MenuItem>
                  <MenuItem value={4}>4チーム</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {teams.map((team, index) => (
              <Grid item xs={12} key={index}>
                <TextField
                  fullWidth
                  label={`チーム${index + 1}の名前`}
                  value={team.name}
                  onChange={(e) => handleTeamNameChange(index, e.target.value)}
                />
              </Grid>
            ))}
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="データURL"
                value={dataUrl}
                onChange={(e) => setDataUrl(e.target.value)}
                helperText="デフォルト: Google Spreadsheet URL"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth
                size="large"
              >
                ゲームを開始する
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default StartScreen;