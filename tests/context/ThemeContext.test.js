/**
 * Tests for ThemeContext
 */

import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';

// Test component to access theme context
function TestComponent() {
  const { theme, resolvedTheme, isDark, toggleTheme, setTheme } = useTheme();
  
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved-theme">{resolvedTheme}</span>
      <span data-testid="is-dark">{isDark.toString()}</span>
      <button onClick={toggleTheme} data-testid="toggle">Toggle</button>
      <button onClick={() => setTheme('dark')} data-testid="set-dark">Set Dark</button>
      <button onClick={() => setTheme('light')} data-testid="set-light">Set Light</button>
      <button onClick={() => setTheme('system')} data-testid="set-system">Set System</button>
    </div>
  );
}

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock matchMedia
const matchMediaMock = jest.fn();

Object.defineProperty(window, 'matchMedia', {
  value: matchMediaMock,
});

describe('ThemeContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    matchMediaMock.mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });
    document.documentElement.classList.remove('dark');
  });

  it('provides default theme as system', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme').textContent).toBe('system');
  });

  it('resolves to light theme when system prefers light', () => {
    matchMediaMock.mockReturnValue({
      matches: false, // light mode
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('resolved-theme').textContent).toBe('light');
    expect(screen.getByTestId('is-dark').textContent).toBe('false');
  });

  it('resolves to dark theme when system prefers dark', () => {
    matchMediaMock.mockReturnValue({
      matches: true, // dark mode
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('resolved-theme').textContent).toBe('dark');
    expect(screen.getByTestId('is-dark').textContent).toBe('true');
  });

  it('toggles theme from light to dark', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    act(() => {
      fireEvent.click(screen.getByTestId('toggle'));
    });

    expect(screen.getByTestId('resolved-theme').textContent).toBe('dark');
    expect(screen.getByTestId('is-dark').textContent).toBe('true');
  });

  it('sets theme to dark explicitly', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    act(() => {
      fireEvent.click(screen.getByTestId('set-dark'));
    });

    expect(screen.getByTestId('theme').textContent).toBe('dark');
    expect(screen.getByTestId('resolved-theme').textContent).toBe('dark');
  });

  it('sets theme to light explicitly', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    act(() => {
      fireEvent.click(screen.getByTestId('set-light'));
    });

    expect(screen.getByTestId('theme').textContent).toBe('light');
    expect(screen.getByTestId('resolved-theme').textContent).toBe('light');
  });

  it('adds dark class to document when theme is dark', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    act(() => {
      fireEvent.click(screen.getByTestId('set-dark'));
    });

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('removes dark class from document when theme is light', () => {
    document.documentElement.classList.add('dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    act(() => {
      fireEvent.click(screen.getByTestId('set-light'));
    });

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('saves theme preference to localStorage', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    act(() => {
      fireEvent.click(screen.getByTestId('set-dark'));
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme-preference', 'dark');
  });

  it('loads theme from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme').textContent).toBe('dark');
  });

  it('throws error when useTheme is used outside ThemeProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTheme must be used within a ThemeProvider');

    consoleError.mockRestore();
  });
});