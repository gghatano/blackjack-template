import React, { useState } from 'react';
import { 
  Button, 
  TextField, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Divider,
  Card,
  CardContent,
  IconButton,
  Tooltip
} from '@mui/material';

const StartScreen = ({ onStartGame, defaultUrl }) => {
  const [teamCount, setTeamCount] = useState(2);
  const [teams, setTeams] = useState([
    { name: 'チーム1', score: 0 },
    { name: 'チーム2', score: 0 },
  ]);
  const [dataUrl, setDataUrl] = useState(defaultUrl || '');
  const [targetScore, setTargetScore] = useState(100);

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
    onStartGame(teams, dataUrl, targetScore);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', mx: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ 
        p: 4, 
        maxWidth: '800px', 
        mx: 'auto', 
        background: 'linear-gradient(135deg, #ffffff, #e6f7ff, #e3f2fd)', 
        border: '1px solid #bbdefb',
        boxShadow: '0 10px 30px rgba(33, 150, 243, 0.15)'
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          mb: 3
        }}>
          {/* トランプアイコン風のタイトルバナー */}
          <Box 
            sx={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              p: 2,
              mb: 2,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #1a237e, #303f9f, #7986cb)',
              boxShadow: '0 4px 8px rgba(26, 35, 126, 0.3)',
              color: 'white',
              width: '100%',
              maxWidth: '500px'
            }}
          >
            <Typography variant="h4" component="h1" align="center" sx={{ 
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}>
              <span style={{ fontSize: '1.5em', marginRight: '0.2em' }}>♠</span>
              なんでもブラックジャック
              <span style={{ fontSize: '1.5em', marginLeft: '0.2em' }}>♥</span>
            </Typography>
          </Box>
          
          <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 1 }}>
            単語と数字で楽しむチーム対戦ゲーム
          </Typography>
        </Box>
        
        {/* ゲームルール説明 */}
        <Card variant="outlined" sx={{ mb: 4, bgcolor: 'background.lightOrange', borderColor: '#ffcc80' }}>
          <CardContent>
            <Typography variant="subtitle1" component="div" color="warning.dark" sx={{ fontWeight: 'bold', mb: 1 }}>
              ゲームルール
            </Typography>
            <Typography variant="body2" color="text.secondary" component="div">
              <ol style={{ margin: '0', paddingLeft: '1.5rem' }}>
                <li>チームを作って交代でプレイします</li>
                <li>各ターンで単語を選び、その数値がチームのスコアに加算されます</li>
                <li>ブラックジャックのように、目標スコアに近づけるのが目的です</li>
                <li>目標スコアを超えると「バスト」で失格になります</li>
                <li>最後まで生き残ったチーム、または目標スコアに最も近いチームが勝利します</li>
              </ol>
            </Typography>
          </CardContent>
        </Card>
        
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

            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="目標スコア"
                value={targetScore}
                onChange={(e) => setTargetScore(Number(e.target.value))}
                InputProps={{
                  inputProps: { min: 1 }
                }}
                helperText="ブラックジャックの21のような目標スコアを設定します"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                チーム設定
              </Typography>
            </Grid>
            
            {teams.map((team, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <TextField
                  fullWidth
                  label={`チーム${index + 1}の名前`}
                  value={team.name}
                  onChange={(e) => handleTeamNameChange(index, e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: theme => theme.palette.teamColors[index % theme.palette.teamColors.length],
                        borderWidth: 2
                      },
                      '&:hover fieldset': {
                        borderColor: theme => theme.palette.teamColors[index % theme.palette.teamColors.length],
                      },
                    },
                    '& .MuiFormLabel-root': {
                      color: theme => theme.palette.teamColors[index % theme.palette.teamColors.length],
                    },
                  }}
                />
              </Grid>
            ))}
            
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Divider sx={{ mb: 2 }}>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                  データ設定
                </Typography>
              </Divider>
              
              <Typography variant="subtitle1" color="primary.dark" gutterBottom>
                単語データのURL
              </Typography>
              
              <TextField
                fullWidth
                label="データ URL"
                value={dataUrl}
                onChange={(e) => setDataUrl(e.target.value)}
                helperText="Google SpreadsheetのURLを入力してください"
                sx={{ mb: 2 }}
              />
              
              <Card variant="outlined" sx={{ mt: 2, bgcolor: '#f5f9ff', borderColor: '#d0d9ff' }}>
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.dark', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '8px' }}>📃</span>
                    データ形式の仕様
                  </Typography>
                  
                  {/* トランプスーツアイコン付きのデータ表 */}
                  <Box mx={2} mb={2} p={1} border="1px solid #c5cae9" borderRadius={2} bgcolor="white" overflow="auto" boxShadow="0 2px 4px rgba(63, 81, 181, 0.1)">
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #9fa8da' }}>
                          <th style={{ padding: '8px', textAlign: 'left', backgroundColor: '#e8eaf6' }}>
                            <span style={{ marginRight: '5px' }}>♠</span> A列: 単語名
                          </th>
                          <th style={{ padding: '8px', textAlign: 'left', backgroundColor: '#e8eaf6' }}>
                            <span style={{ marginRight: '5px' }}>♥</span> B列: 数値
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid #d1d9ff' }}>
                          <td style={{ padding: '8px' }}>東京ドーム</td>
                          <td style={{ padding: '8px', fontWeight: 'bold' }}>55,000</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #d1d9ff' }}>
                          <td style={{ padding: '8px' }}>横浜スタジアム</td>
                          <td style={{ padding: '8px', fontWeight: 'bold' }}>34,046</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #d1d9ff' }}>
                          <td style={{ padding: '8px' }}>国立竹馬競技場</td>
                          <td style={{ padding: '8px', fontWeight: 'bold' }}>72,000</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '8px' }}>京セラドーム</td>
                          <td style={{ padding: '8px', fontWeight: 'bold' }}>14,500</td>
                        </tr>
                      </tbody>
                    </table>
                  </Box>
                  
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                      <span style={{ color: '#3f51b5', fontWeight: 'bold' }}>データの形式:</span>
                    </Typography>
                    <ul style={{ marginLeft: '20px', fontSize: '0.875rem', color: '#424242' }}>
                      <li>A列: 単語名（例：場所名、都市名、商品名など）</li>
                      <li>B列: 数値（例：人口、収容人数、価格など）</li>
                      <li>1行目はヘッダー行、2行目以降がデータとして読み込まれます</li>
                    </ul>
                  </Box>
                  
                  <Box sx={{ mt: 2, p: 1, borderLeft: '3px solid #3f51b5', bgcolor: '#f5f9ff' }}>
                    <Typography variant="body2" color="text.secondary">
                      <span style={{ fontWeight: 'bold' }}>公開方法:</span> Googleスプレッドシートで [ファイル] → [共有] → [リンクを取得] → 
                      「リンクを知っている全員」に設定
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 3 }}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth
                size="large"
                sx={{
                  py: 2,
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #1a237e, #303f9f)',
                  boxShadow: '0 4px 10px rgba(26, 35, 126, 0.3)',
                  borderRadius: '8px',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #303f9f, #3949ab)',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '1.5em', marginRight: '0.4em' }}>♠</span>
                  ゲームを開始する
                  <span style={{ fontSize: '1.5em', marginLeft: '0.4em' }}>♥</span>
                </Box>
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default StartScreen;