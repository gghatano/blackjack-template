import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import CasinoIcon from '@mui/icons-material/Casino';
import GroupsIcon from '@mui/icons-material/Groups';
import StorageIcon from '@mui/icons-material/Storage';
import LinkIcon from '@mui/icons-material/Link';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import BoltIcon from '@mui/icons-material/Bolt';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const SAMPLE_DATA_SETS = [
  {
    id: 'event-venues',
    title: 'イベント会場の収容観客数',
    url: 'https://docs.google.com/spreadsheets/d/1Y-gSB3luEaQ8YVCWtBIxZ-xdAurTzlpDuwQ3Y7pRjww/edit?gid=0#gid=0',
    description: '東京ドーム、横浜アリーナなど',
    targetScore: 90000,
  },
  {
    id: 'baseball-homeruns',
    title: 'プロ野球選手の通算本塁打数',
    url: 'https://docs.google.com/spreadsheets/d/1-JpmCqCFV4DzznhJGlMUtuR-ieWzE_bQivAQtkAAQBE/edit',
    description: '有名プロ野球選手の通算HR',
    targetScore: 500,
  },
  {
    id: 'comedian-subscribers',
    title: 'お笑い芸人のYouTube登録者数',
    url: 'https://docs.google.com/spreadsheets/d/10FYr1dt4X--3HX6OX9wF_oRDuqO4xdwtJR9cHJQ57r0/edit?usp=drivesdk',
    description: '人気お笑い芸人のYouTube登録者数',
    targetScore: 1000000,
  },
];

const STEPS = ['データ', 'チーム', '確認'];

const StartScreen = ({ onStartGame }) => {
  const theme = useTheme();
  const teamColors = theme.palette.teamColors;
  const goldMain = theme.palette.casino.gold[600];
  const feltDark = theme.palette.casino.felt[900];

  const [activeStep, setActiveStep] = useState(0);

  const [dataSourceType, setDataSourceType] = useState('sample');
  const [selectedSampleData, setSelectedSampleData] = useState('event-venues');
  const [customUrl, setCustomUrl] = useState('');
  const [targetScore, setTargetScore] = useState(90000);

  const [teamCount, setTeamCount] = useState(2);
  const [teams, setTeams] = useState([
    { name: 'チーム1', score: 0 },
    { name: 'チーム2', score: 0 },
  ]);

  const selectedSample = useMemo(
    () => SAMPLE_DATA_SETS.find((d) => d.id === selectedSampleData),
    [selectedSampleData]
  );

  const handleSampleChange = (id) => {
    setSelectedSampleData(id);
    const ds = SAMPLE_DATA_SETS.find((d) => d.id === id);
    if (ds) setTargetScore(ds.targetScore);
  };

  const handleTeamCountChange = (count) => {
    if (count < 1 || count > 4) return;
    setTeamCount(count);
    if (count > teams.length) {
      const newTeams = [...teams];
      for (let i = teams.length; i < count; i++) {
        newTeams.push({ name: `チーム${i + 1}`, score: 0 });
      }
      setTeams(newTeams);
    } else if (count < teams.length) {
      setTeams(teams.slice(0, count));
    }
  };

  const handleTeamNameChange = (index, value) => {
    const next = [...teams];
    next[index] = { ...next[index], name: value };
    setTeams(next);
  };

  const isStepValid = (step) => {
    if (step === 0) {
      if (dataSourceType === 'custom' && !customUrl.trim()) return false;
      if (!targetScore || targetScore <= 0) return false;
      return true;
    }
    if (step === 1) {
      return teams.every((t) => t.name.trim());
    }
    return true;
  };

  const handleNext = () => setActiveStep((s) => Math.min(s + 1, STEPS.length - 1));
  const handleBack = () => setActiveStep((s) => Math.max(s - 1, 0));

  const handleStart = () => {
    const url = dataSourceType === 'sample' ? selectedSample.url : customUrl;
    onStartGame(teams, url, targetScore);
  };

  const handleQuickStart = () => {
    const defaultDs = SAMPLE_DATA_SETS[0]; // イベント会場
    const defaultTeams = [
      { name: 'チーム1', score: 0 },
      { name: 'チーム2', score: 0 },
    ];
    onStartGame(defaultTeams, defaultDs.url, defaultDs.targetScore);
  };

  return (
    <div className="start-shell">
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
          <CasinoIcon sx={{ fontSize: 44, color: goldMain }} />
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 800,
              color: 'common.white',
              letterSpacing: '0.02em',
              textShadow: '0 2px 0 rgba(0,0,0,0.45), 0 0 18px rgba(212,175,55,0.4)',
            }}
          >
            Word BlackJack
          </Typography>
          <CasinoIcon sx={{ fontSize: 44, color: goldMain }} />
        </Stack>
        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.85)' }}>
          単語を選んで、目標スコアにいちばん近づけたチームの勝ち
        </Typography>
        <Box className="gold-divider" sx={{ mt: 2, maxWidth: 480, mx: 'auto' }} />

        {/* クイックスタート — 設定無しで即開始 */}
        <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<BoltIcon />}
            onClick={handleQuickStart}
            sx={{
              py: 1.4,
              px: 4,
              fontSize: '1.1rem',
              boxShadow: '0 4px 0 rgba(122,91,16,0.6), 0 8px 22px rgba(0,0,0,0.35)',
            }}
          >
            とりあえず始める
          </Button>
        </Stack>
        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'rgba(255,255,255,0.65)' }}>
          サンプル「イベント会場」/ 2チーム / 目標90,000点 で即スタート
        </Typography>
      </Box>

      <Paper
        elevation={8}
        sx={{
          p: { xs: 2.5, sm: 4 },
          borderRadius: 3,
          background: 'linear-gradient(180deg, #fff8e6 0%, #fbeec1 100%)',
          border: `1px solid ${theme.palette.casino.gold[700]}`,
        }}
      >
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{
            mb: 4,
            '& .MuiStepLabel-label': { fontWeight: 700, color: feltDark },
            '& .MuiStepIcon-root': { color: '#bda66c' },
            '& .MuiStepIcon-root.Mui-active': { color: goldMain },
            '& .MuiStepIcon-root.Mui-completed': { color: theme.palette.casino.felt[700] },
          }}
        >
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Stack spacing={3}>
            <SectionTitle icon={<StorageIcon />} text="使用するデータを選ぶ" />

            <Stack direction="row" spacing={1.5}>
              <SourceChoice
                active={dataSourceType === 'sample'}
                onClick={() => setDataSourceType('sample')}
                title="サンプル"
                desc="準備済みデータから選ぶ"
              />
              <SourceChoice
                active={dataSourceType === 'custom'}
                onClick={() => setDataSourceType('custom')}
                title="カスタム"
                desc="自分のスプレッドシート"
              />
            </Stack>

            {dataSourceType === 'sample' ? (
              <>
                <FormControl fullWidth>
                  <InputLabel id="sample-data-label">サンプルデータ</InputLabel>
                  <Select
                    labelId="sample-data-label"
                    label="サンプルデータ"
                    value={selectedSampleData}
                    onChange={(e) => handleSampleChange(e.target.value)}
                  >
                    {SAMPLE_DATA_SETS.map((ds) => (
                      <MenuItem key={ds.id} value={ds.id}>
                        {ds.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {selectedSample && (
                  <Card variant="outlined" sx={{ borderColor: 'rgba(0,0,0,0.12)', bgcolor: 'rgba(255,255,255,0.6)' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 0.5 }}>
                        {selectedSample.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {selectedSample.description}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          label={`目標スコア ${selectedSample.targetScore.toLocaleString()}`}
                          color="secondary"
                          size="small"
                        />
                        <Typography variant="caption" color="text.secondary">
                          ※ 目標スコアは下で変更できます
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Google Spreadsheet URL"
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  InputProps={{
                    startAdornment: <LinkIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                  }}
                  helperText="A列: 単語名 / B列: 数値 の形式で、リンクを「閲覧者」公開してください"
                />
              </Stack>
            )}

            <TextField
              fullWidth
              type="number"
              label="目標スコア"
              value={targetScore}
              onChange={(e) => setTargetScore(Number(e.target.value))}
              InputProps={{ inputProps: { min: 1 } }}
              helperText="このスコアにいちばん近づけたチームの勝ち。超えると失格です"
            />
          </Stack>
        )}

        {activeStep === 1 && (
          <Stack spacing={3}>
            <SectionTitle icon={<GroupsIcon />} text="チーム設定" />

            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 700 }}>
                参加チーム数
              </Typography>
              <Stack direction="row" spacing={1}>
                {[1, 2, 3, 4].map((n) => (
                  <Button
                    key={n}
                    variant={teamCount === n ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={() => handleTeamCountChange(n)}
                    sx={{ minWidth: 60 }}
                  >
                    {n}
                  </Button>
                ))}
              </Stack>
            </Box>

            <Grid container spacing={2}>
              {teams.map((team, index) => {
                const tc = teamColors[index % teamColors.length];
                return (
                  <Grid item xs={12} sm={6} key={index}>
                    <TextField
                      fullWidth
                      label={`チーム${index + 1}`}
                      value={team.name}
                      onChange={(e) => handleTeamNameChange(index, e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: tc, borderWidth: 2 },
                          '&:hover fieldset': { borderColor: tc },
                          '&.Mui-focused fieldset': { borderColor: tc },
                        },
                        '& .MuiFormLabel-root': { color: tc, fontWeight: 700 },
                        '& .MuiFormLabel-root.Mui-focused': { color: tc },
                      }}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Stack>
        )}

        {activeStep === 2 && (
          <Stack spacing={3}>
            <SectionTitle icon={<PlayArrowIcon />} text="この設定でスタート" />

            <Card variant="outlined" sx={{ bgcolor: 'rgba(255,255,255,0.6)' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">データ</Typography>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {dataSourceType === 'sample' ? selectedSample.title : 'カスタムスプレッドシート'}
                </Typography>
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="body2" color="text.secondary">目標スコア</Typography>
                <Typography variant="h6" className="tnum" sx={{ mb: 1, color: theme.palette.casino.gold[800] }}>
                  {targetScore.toLocaleString()}
                </Typography>
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  チーム ({teamCount})
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {teams.map((t, i) => (
                    <Chip
                      key={i}
                      label={t.name}
                      sx={{
                        bgcolor: teamColors[i % teamColors.length],
                        color: '#fff',
                        fontWeight: 700,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                      }}
                    />
                  ))}
                </Stack>
              </CardContent>
            </Card>

            <RulesCard />
          </Stack>
        )}

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowBackIosNewIcon />}
            color="secondary"
          >
            戻る
          </Button>

          {activeStep < STEPS.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIosIcon />}
              onClick={handleNext}
              disabled={!isStepValid(activeStep)}
              size="large"
            >
              次へ
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              size="large"
              endIcon={<PlayArrowIcon />}
              onClick={handleStart}
              sx={{ py: 1.4, px: 4, fontSize: '1.1rem' }}
            >
              ゲーム開始
            </Button>
          )}
        </Stack>
      </Paper>
    </div>
  );
};

const SectionTitle = ({ icon, text }) => (
  <Stack direction="row" spacing={1} alignItems="center">
    {React.cloneElement(icon, { sx: { color: 'secondary.main' } })}
    <Typography variant="h5" sx={{ color: 'secondary.dark' }}>
      {text}
    </Typography>
  </Stack>
);

const SourceChoice = ({ active, onClick, title, desc }) => {
  const theme = useTheme();
  const goldMain = theme.palette.casino.gold[600];
  return (
    <Card
      onClick={onClick}
      sx={{
        flex: 1,
        cursor: 'pointer',
        p: 2,
        border: '2px solid',
        borderColor: active ? goldMain : 'rgba(0,0,0,0.12)',
        bgcolor: active ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.6)',
        transition: 'all 0.2s ease',
        '&:hover': { borderColor: goldMain, transform: 'translateY(-1px)' },
      }}
      elevation={active ? 3 : 0}
    >
      <Typography variant="h6" sx={{ mb: 0.25 }}>
        {title}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {desc}
      </Typography>
    </Card>
  );
};

const RulesCard = () => (
  <Card variant="outlined" sx={{ bgcolor: 'rgba(255,255,255,0.4)' }}>
    <CardContent>
      <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
        ルール
      </Typography>
      <Box component="ol" sx={{ m: 0, pl: 2.5, '& li': { mb: 0.5 } }}>
        <li>チームが順番に単語を1つ選び、その数値が加算されます</li>
        <li>目標スコアにいちばん近づけたチームの勝ち</li>
        <li>目標スコアを<strong>超えるとバスト</strong>（失格）です</li>
        <li>最後の1チームが残るか、全員バストすれば終了です</li>
      </Box>
    </CardContent>
  </Card>
);

export default StartScreen;
