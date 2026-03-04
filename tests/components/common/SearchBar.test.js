/**
 * SearchBar Component Tests
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from '@testing-library/react';
import SearchBar from '@/components/common/SearchBar';

describe('SearchBar', () => {
  // Mock timers for debounce testing
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders with default placeholder', () => {
    const onChange = jest.fn();
    render(<SearchBar value="" onChange={onChange} />);
    
    expect(screen.getByPlaceholderText('Rechercher...')).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    const onChange = jest.fn();
    render(<SearchBar value="" onChange={onChange} placeholder="Rechercher un jeu..." />);
    
    expect(screen.getByPlaceholderText('Rechercher un jeu...')).toBeInTheDocument();
  });

  it('displays the current value', () => {
    const onChange = jest.fn();
    render(<SearchBar value="Catan" onChange={onChange} />);
    
    expect(screen.getByDisplayValue('Catan')).toBeInTheDocument();
  });

  it('calls onChange after debounce delay', () => {
    const onChange = jest.fn();
    render(<SearchBar value="" onChange={onChange} debounce={300} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Azul' } });
    
    // onChange should not be called immediately
    expect(onChange).not.toHaveBeenCalled();
    
    // Fast-forward time by 300ms
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    // Now onChange should be called
    expect(onChange).toHaveBeenCalledWith('Azul');
  });

  it('calls onChange immediately on Enter key', () => {
    const onChange = jest.fn();
    render(<SearchBar value="" onChange={onChange} debounce={300} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Splendor' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    // onChange should be called immediately without waiting for debounce
    expect(onChange).toHaveBeenCalledWith('Splendor');
  });

  it('shows clear button when value is present', () => {
    const onChange = jest.fn();
    render(<SearchBar value="Catan" onChange={onChange} />);
    
    // Clear button should be visible
    expect(screen.getByTitle('Effacer')).toBeInTheDocument();
  });

  it('hides clear button when value is empty', () => {
    const onChange = jest.fn();
    render(<SearchBar value="" onChange={onChange} />);
    
    // Clear button should not be visible
    expect(screen.queryByTitle('Effacer')).not.toBeInTheDocument();
  });

  it('clears value when clear button is clicked', () => {
    const onChange = jest.fn();
    render(<SearchBar value="Catan" onChange={onChange} />);
    
    const clearButton = screen.getByTitle('Effacer');
    fireEvent.click(clearButton);
    
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('updates local value when external value changes', () => {
    const onChange = jest.fn();
    const { rerender } = render(<SearchBar value="Catan" onChange={onChange} />);
    
    expect(screen.getByDisplayValue('Catan')).toBeInTheDocument();
    
    // Update with new external value
    rerender(<SearchBar value="Azul" onChange={onChange} />);
    
    expect(screen.getByDisplayValue('Azul')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const onChange = jest.fn();
    render(<SearchBar value="" onChange={onChange} className="custom-class" />);
    
    const container = screen.getByRole('textbox').parentElement;
    expect(container).toHaveClass('custom-class');
  });
});