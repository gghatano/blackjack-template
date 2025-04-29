import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

// StartScreenとGameScreenをモック
jest.mock('../components/StartScreen', () => {
  return function MockStartScreen({ onStartGame, defaultUrl }) {
    return (
      <div data-testid="start-screen">
        <button 
          onClick={() => onStartGame([{ name: 'Team 1', score: 0 }], defaultUrl, 90000)}
          data-testid="start-game-button"
        >
          Start Game
        </button>
      </div>
    );
  };
});

jest.mock('../components/GameScreen', () => {
  return function MockGameScreen({ teams, dataUrl, targetScore, onResetGame }) {
    return (
      <div data-testid="game-screen">
        <div data-testid="teams-data">{JSON.stringify(teams)}</div>
        <div data-testid="data-url">{dataUrl}</div>
        <div data-testid="target-score">{targetScore}</div>
        <button onClick={onResetGame} data-testid="reset-game-button">
          Reset Game
        </button>
      </div>
    );
  };
});

describe('App Component', () => {
  test('renders StartScreen initially', () => {
    render(<App />);
    const startScreen = screen.getByTestId('start-screen');
    expect(startScreen).toBeInTheDocument();
  });

  test('switches to GameScreen when game starts', () => {
    render(<App />);
    
    // StartScreenから開始ボタンをクリック
    const startButton = screen.getByTestId('start-game-button');
    fireEvent.click(startButton);
    
    // GameScreenに切り替わっていることを確認
    const gameScreen = screen.getByTestId('game-screen');
    expect(gameScreen).toBeInTheDocument();
    
    // チームデータが正しく渡されているか確認
    const teamsData = screen.getByTestId('teams-data');
    expect(teamsData.textContent).toBe(JSON.stringify([{ name: 'Team 1', score: 0 }]));
    
    // ターゲットスコアが正しく設定されているか確認
    const targetScore = screen.getByTestId('target-score');
    expect(targetScore.textContent).toBe('90000');
  });

  test('resets game when reset button is clicked', () => {
    render(<App />);
    
    // ゲームを開始
    const startButton = screen.getByTestId('start-game-button');
    fireEvent.click(startButton);
    
    // リセットボタンをクリック
    const resetButton = screen.getByTestId('reset-game-button');
    fireEvent.click(resetButton);
    
    // StartScreenに戻っていることを確認
    const startScreen = screen.getByTestId('start-screen');
    expect(startScreen).toBeInTheDocument();
  });
});
