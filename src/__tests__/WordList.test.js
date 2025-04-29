import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import WordList from '../components/WordList';

// ThemeProviderでラップするためのヘルパー関数
const renderWithTheme = (ui, options) => {
  return render(
    <ThemeProvider theme={theme}>{ui}</ThemeProvider>,
    options
  );
};

describe('WordList Component', () => {
  const mockWords = [
    { name: '単語1', value: 10000 },
    { name: '単語2', value: 20000 },
    { name: '単語3', value: 30000 }
  ];
  
  const mockUsedWords = ['単語2'];
  const mockSelectedWord = { name: '単語1', value: 10000 };
  const mockOnSelectWord = jest.fn();
  const mockOnSkip = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders words list correctly', () => {
    renderWithTheme(
      <WordList
        words={mockWords}
        usedWords={mockUsedWords}
        selectedWord={null}
        onSelectWord={mockOnSelectWord}
        onSkip={mockOnSkip}
        disabled={false}
      />
    );
    
    // スキップボタンが表示されていることを確認
    expect(screen.getByText('スキップ')).toBeInTheDocument();
    
    // すべての単語が表示されていることを確認
    expect(screen.getByText('単語1')).toBeInTheDocument();
    expect(screen.getByText('単語2')).toBeInTheDocument();
    expect(screen.getByText('単語3')).toBeInTheDocument();
  });

  test('handles skip button click', () => {
    renderWithTheme(
      <WordList
        words={mockWords}
        usedWords={mockUsedWords}
        selectedWord={null}
        onSelectWord={mockOnSelectWord}
        onSkip={mockOnSkip}
        disabled={false}
      />
    );
    
    // スキップボタンをクリック
    const skipButton = screen.getByText('スキップ');
    fireEvent.click(skipButton);
    
    // onSkipが呼び出されたことを確認
    expect(mockOnSkip).toHaveBeenCalledTimes(1);
  });

  test('handles word selection', () => {
    renderWithTheme(
      <WordList
        words={mockWords}
        usedWords={mockUsedWords}
        selectedWord={null}
        onSelectWord={mockOnSelectWord}
        onSkip={mockOnSkip}
        disabled={false}
      />
    );
    
    // 単語をクリック
    const word = screen.getByText('単語1');
    fireEvent.click(word);
    
    // onSelectWordが正しい引数で呼び出されたことを確認
    expect(mockOnSelectWord).toHaveBeenCalledTimes(1);
    expect(mockOnSelectWord).toHaveBeenCalledWith(mockWords[0]);
  });

  test('does not allow selection of used words', () => {
    renderWithTheme(
      <WordList
        words={mockWords}
        usedWords={mockUsedWords}
        selectedWord={null}
        onSelectWord={mockOnSelectWord}
        onSkip={mockOnSkip}
        disabled={false}
      />
    );
    
    // 使用済みの単語をクリック
    const usedWord = screen.getByText('単語2');
    fireEvent.click(usedWord);
    
    // onSelectWordが呼び出されないことを確認
    expect(mockOnSelectWord).not.toHaveBeenCalled();
  });

  test('shows selected word state', () => {
    renderWithTheme(
      <WordList
        words={mockWords}
        usedWords={mockUsedWords}
        selectedWord={mockSelectedWord}
        onSelectWord={mockOnSelectWord}
        onSkip={mockOnSkip}
        disabled={false}
      />
    );
    
    // 選択された単語には特別なスタイリングがあるが、CSSのテストはJSDOM制限のため困難
    // ここでは、単語が表示されていることのみを確認
    expect(screen.getByText('単語1')).toBeInTheDocument();
  });

  test('disables all interactions when disabled prop is true', () => {
    renderWithTheme(
      <WordList
        words={mockWords}
        usedWords={mockUsedWords}
        selectedWord={null}
        onSelectWord={mockOnSelectWord}
        onSkip={mockOnSkip}
        disabled={true}
      />
    );
    
    // スキップボタンが無効化されていることを確認
    const skipButton = screen.getByText('スキップ');
    expect(skipButton).toBeDisabled();
    
    // 単語をクリックしても何も起こらないことを確認
    const word = screen.getByText('単語1');
    fireEvent.click(word);
    expect(mockOnSelectWord).not.toHaveBeenCalled();
  });
});
