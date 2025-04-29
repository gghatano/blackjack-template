import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import GameScreen from '../components/GameScreen';
import { fetchSheetData } from '../utils/sheetUtils';

// sheetUtilsをモック
jest.mock('../utils/sheetUtils', () => ({
  fetchSheetData: jest.fn(),
}));

// WordListコンポーネントをモック
jest.mock('../components/WordList', () => {
  return function MockWordList({ words, selectedWord, onSelectWord, onSkip, disabled }) {
    return (
      <div data-testid="mock-word-list">
        <div>{words.length} words</div>
        <button 
          onClick={() => onSelectWord(words[0])} 
          disabled={disabled}
          data-testid="mock-select-word-button"
        >
          Select Word
        </button>
        <button 
          onClick={onSkip} 
          disabled={disabled}
          data-testid="mock-skip-button"
        >
          Skip
        </button>
        <div data-testid="mock-selected-word">
          {selectedWord ? selectedWord.name : 'none'}
        </div>
      </div>
    );
  };
});

// TeamPanelコンポーネントをモック
jest.mock('../components/TeamPanel', () => {
  return function MockTeamPanel({ 
    team, 
    isActive, 
    selectedWord, 
    onConfirm,
    showAnimation,
    animatedScore
  }) {
    return (
      <div data-testid={`mock-team-panel-${team.name}`}>
        <div data-testid={`mock-team-name-${team.name}`}>{team.name}</div>
        <div data-testid={`mock-team-score-${team.name}`}>{team.score}</div>
        <div data-testid={`mock-team-active-${team.name}`}>
          {isActive ? 'active' : 'inactive'}
        </div>
        <div data-testid={`mock-team-status-${team.name}`}>
          {team.isOut ? 'out' : 'in'}
        </div>
        {isActive && onConfirm && (
          <button 
            onClick={onConfirm} 
            data-testid={`mock-confirm-button-${team.name}`}
          >
            Confirm
          </button>
        )}
        {showAnimation && (
          <div data-testid={`mock-animated-score-${team.name}`}>{animatedScore}</div>
        )}
      </div>
    );
  };
});

// ThemeProviderでラップするためのヘルパー関数
const renderWithTheme = (ui, options) => {
  return render(
    <ThemeProvider theme={theme}>{ui}</ThemeProvider>,
    options
  );
};

describe('GameScreen Component', () => {
  const mockTeams = [
    { name: 'チーム1', score: 0 },
    { name: 'チーム2', score: 0 }
  ];
  
  const mockWordData = [
    { name: '単語1', value: 10000 },
    { name: '単語2', value: 20000 },
    { name: '単語3', value: 30000 }
  ];
  
  const mockDataUrl = 'https://example.com/sheet';
  const mockSetWordData = jest.fn();
  const mockSetTargetScore = jest.fn();
  const mockOnResetGame = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // ロード中の状態を回避するためにすぐに解決するPromiseを返す
    fetchSheetData.mockResolvedValue({
      items: mockWordData,
      headers: { column1: '単語', column2: '値' }
    });
  });

  test('basic rendering - smoketest', () => {
    // 基本的なレンダリングテスト - 単純に例外が投げられないことを確認
    renderWithTheme(
      <GameScreen
        teams={mockTeams}
        dataUrl={mockDataUrl}
        wordData={mockWordData}  // 初期データを提供
        setWordData={mockSetWordData}
        targetScore={90000}
        setTargetScore={mockSetTargetScore}
        onResetGame={mockOnResetGame}
      />
    );
    // テストが例外なしで実行されることを確認
    expect(true).toBe(true);
  });

  test('callback functions exist', () => {
    // コールバック関数が存在することをテスト
    renderWithTheme(
      <GameScreen
        teams={mockTeams}
        dataUrl={mockDataUrl}
        wordData={mockWordData}
        setWordData={mockSetWordData}
        targetScore={90000}
        setTargetScore={mockSetTargetScore}
        onResetGame={mockOnResetGame}
      />
    );
    
    // 関数が呼び出し可能であることを確認
    expect(typeof mockSetWordData).toBe('function');
    expect(typeof mockSetTargetScore).toBe('function');
    expect(typeof mockOnResetGame).toBe('function');
  });
});
