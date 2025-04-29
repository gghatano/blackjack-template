import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import TeamPanel from '../components/TeamPanel';

// ThemeProviderでラップするためのヘルパー関数
const renderWithTheme = (ui, options) => {
  return render(
    <ThemeProvider theme={theme}>{ui}</ThemeProvider>,
    options
  );
};

describe('TeamPanel Component', () => {
  const mockTeam = {
    name: 'テストチーム',
    score: 5000,
    isOut: false
  };
  
  const mockSelectedWord = {
    name: 'テスト単語',
    value: 2000
  };
  
  const mockOnConfirm = jest.fn();

  test('renders team information correctly', () => {
    renderWithTheme(
      <TeamPanel
        id="test-team-panel"
        team={mockTeam}
        isActive={false}
        targetScore={90000}
        selectedWord={null}
        onConfirm={null}
        showAnimation={false}
        animatedScore={0}
      />
    );
    
    // チーム名が表示されていることを確認
    expect(screen.getByText(mockTeam.name)).toBeInTheDocument();
    
    // 現在のスコアが表示されていることを確認
    expect(screen.getByText(/現在のスコア:/i)).toBeInTheDocument();
    expect(screen.getByText('5000')).toBeInTheDocument();
    
    // 残りスコアが表示されていることを確認
    expect(screen.getByText(/残り:/i)).toBeInTheDocument();
    expect(screen.getByText('85000')).toBeInTheDocument();
  });

  test('renders active state correctly', () => {
    renderWithTheme(
      <TeamPanel
        id="test-team-panel"
        team={mockTeam}
        isActive={true}
        targetScore={90000}
        selectedWord={null}
        onConfirm={mockOnConfirm}
        showAnimation={false}
        animatedScore={0}
      />
    );
    
    // アクティブ状態で「単語を選択してください」が表示されることを確認
    expect(screen.getAllByText(/単語を選択してください/i)[0]).toBeInTheDocument();
  });

  test('renders selected word and confirm button when word is selected', () => {
    renderWithTheme(
      <TeamPanel
        id="test-team-panel"
        team={mockTeam}
        isActive={true}
        targetScore={90000}
        selectedWord={mockSelectedWord}
        onConfirm={mockOnConfirm}
        showAnimation={false}
        animatedScore={0}
      />
    );
    
    // 選択された単語が表示されることを確認
    expect(screen.getByText(/選択中:/i)).toBeInTheDocument();
    expect(screen.getByText('テスト単語')).toBeInTheDocument();
    
    // 確定ボタンが表示されることを確認
    const confirmButton = screen.getByText('確定する');
    expect(confirmButton).toBeInTheDocument();
    
    // 確定ボタンをクリックした時のハンドラが呼び出されることを確認
    fireEvent.click(confirmButton);
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  test('renders out state correctly', () => {
    const outTeam = {
      ...mockTeam,
      isOut: true
    };
    
    renderWithTheme(
      <TeamPanel
        id="test-team-panel"
        team={outTeam}
        isActive={false}
        targetScore={90000}
        selectedWord={null}
        onConfirm={null}
        showAnimation={false}
        animatedScore={0}
      />
    );
    
    // 失格メッセージが表示されることを確認
    expect(screen.getByText(/目標スコアを超えました！/i)).toBeInTheDocument();
    expect(screen.getByText('失格')).toBeInTheDocument();
  });

  test('renders score animation correctly', () => {
    renderWithTheme(
      <TeamPanel
        id="test-team-panel"
        team={mockTeam}
        isActive={true}
        targetScore={90000}
        selectedWord={null}
        onConfirm={null}
        showAnimation={true}
        animatedScore={7000}
      />
    );
    
    // アニメーションスコアが表示されることを確認
    expect(screen.getByText('7000')).toBeInTheDocument();
  });
});
