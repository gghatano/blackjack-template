// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// CRAのテスト環境とVitestの両方で動作するようにポリフィル
// CRAではこれは自動的にセットアップされるが、Vitestでは明示的にインポートが必要
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// jestのモック関数をvitestと互換性を持たせる
if (typeof vi !== 'undefined') {
  // Vitest環境の場合、jestのグローバル関数を提供
  global.jest = {
    fn: vi.fn,
    mock: vi.mock,
    spyOn: vi.spyOn,
    clearAllMocks: vi.clearAllMocks,
    resetAllMocks: vi.resetAllMocks,
    restoreAllMocks: vi.restoreAllMocks,
  };
}
