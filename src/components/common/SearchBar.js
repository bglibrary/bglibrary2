/**
 * SearchBar Component
 * 
 * A generic search bar component shared between visitor and admin interfaces.
 * Provides text-based filtering for game lists.
 */

import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * SearchBar - Reusable search input component
 * 
 * @param {Object} props
 * @param {string} props.value - Current search query value
 * @param {Function} props.onChange - Callback when search query changes
 * @param {string} props.placeholder - Placeholder text (default: "Rechercher...")
 * @param {number} props.debounce - Debounce delay in ms (default: 300)
 * @param {string} props.className - Additional CSS classes
 */
export default function SearchBar({ 
  value, 
  onChange, 
  placeholder = "Rechercher...",
  debounce = 300,
  className = ""
}) {
  const [localValue, setLocalValue] = useState(value || '');
  const debounceRef = useRef(null);

  // Sync local value with external value
  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  // Handle input change with debounce
  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    // Clear existing timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new timeout for debounced callback
    debounceRef.current = setTimeout(() => {
      onChange(newValue);
    }, debounce);
  }, [onChange, debounce]);

  // Handle immediate change on Enter key
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      onChange(localValue);
    }
  }, [onChange, localValue]);

  // Handle clear button
  const handleClear = useCallback(() => {
    setLocalValue('');
    onChange('');
  }, [onChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
        🔍
      </span>
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 rounded-button border border-border bg-card text-body focus:outline-none focus:border-primary transition-colors"
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
          title="Effacer"
        >
          ✕
        </button>
      )}
    </div>
  );
}