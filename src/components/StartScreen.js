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
    <Box sx={{ width: '100%', maxWidth: '100%', mx: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: '800px', mx: 'auto' }}>
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
              <Box mt={2} p={2} bgcolor="#f5f5f5" borderRadius={1}>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                  スプレッドシートの仕様:
                </Typography>
                <Typography variant="body2" paragraph>
                  以下の形式でスプレッドシートを準備してください：
                </Typography>
                
                {/* 表形式のサンプル */}
                <Box mx={2} mb={2} p={1} border="1px solid #ddd" borderRadius={1} bgcolor="white" overflow="auto">
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #ddd' }}>
                        <th style={{ padding: '8px', textAlign: 'left', backgroundColor: '#f9f9f9' }}>A列: 単語名</th>
                        <th style={{ padding: '8px', textAlign: 'left', backgroundColor: '#f9f9f9' }}>B列: 数値</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #ddd' }}>
                        <td style={{ padding: '8px' }}>東京ドーム</td>
                        <td style={{ padding: '8px' }}>55000</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #ddd' }}>
                        <td style={{ padding: '8px' }}>横浜スタジアム</td>
                        <td style={{ padding: '8px' }}>34046</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #ddd' }}>
                        <td style={{ padding: '8px' }}>国立竹馬競技場</td>
                        <td style={{ padding: '8px' }}>72000</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px' }}>京セラドーム</td>
                        <td style={{ padding: '8px' }}>14500</td>
                      </tr>
                    </tbody>
                  </table>
                </Box>
                
                <ul style={{ marginLeft: '20px', fontSize: '0.875rem' }}>
                  <li>A列: 単語名（例：場所名、都市名、商品名など）</li>
                  <li>B列: 数値（例：人口、収容人数、価格など）</li>
                  <li>1行目はヘッダー行として扱われます</li>
                  <li>2行目以降のデータが読み込まれます</li>
                  <li>シートは公開設定にしてください</li>
                </ul>
                <Typography variant="body2">
                  公開方法: Googleスプレッドシートで [ファイル] → [共有] → [リンクを取得] → 
                  「リンクを知っている全員」に設定
                </Typography>
              </Box>
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