/**
 * Tests for ConfirmDialog Component
 * 
 * Tests the confirmation dialog with dark mode support
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConfirmDialog from '../../../src/components/common/ConfirmDialog';

describe('ConfirmDialog', () => {
  const defaultProps = {
    title: 'Confirmer l\'action',
    message: 'Êtes-vous sûr de vouloir effectuer cette action ?',
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render title and message', () => {
    render(<ConfirmDialog {...defaultProps} />);
    
    expect(screen.getByText('Confirmer l\'action')).toBeInTheDocument();
    expect(screen.getByText('Êtes-vous sûr de vouloir effectuer cette action ?')).toBeInTheDocument();
  });

  it('should render confirm and cancel buttons', () => {
    render(<ConfirmDialog {...defaultProps} />);
    
    expect(screen.getByRole('button', { name: 'Confirmer' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Annuler' })).toBeInTheDocument();
  });

  it('should call onConfirm when confirm button is clicked', () => {
    render(<ConfirmDialog {...defaultProps} />);
    
    const confirmButton = screen.getByRole('button', { name: 'Confirmer' });
    fireEvent.click(confirmButton);
    
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when cancel button is clicked', () => {
    render(<ConfirmDialog {...defaultProps} />);
    
    const cancelButton = screen.getByRole('button', { name: 'Annuler' });
    fireEvent.click(cancelButton);
    
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  describe('Dark mode support', () => {
    it('should use bg-card class for dark mode support', () => {
      render(<ConfirmDialog {...defaultProps} />);
      
      const dialog = screen.getByText('Confirmer l\'action').closest('div');
      expect(dialog).toHaveClass('bg-card');
    });

    it('should not use fixed bg-white class', () => {
      render(<ConfirmDialog {...defaultProps} />);
      
      const dialog = screen.getByText('Confirmer l\'action').closest('div');
      expect(dialog).not.toHaveClass('bg-white');
    });

    it('should have dark mode hover class on cancel button', () => {
      render(<ConfirmDialog {...defaultProps} />);
      
      const cancelButton = screen.getByRole('button', { name: 'Annuler' });
      expect(cancelButton).toHaveClass('dark:hover:bg-cream/10');
    });

    it('should use text-text-primary for title', () => {
      render(<ConfirmDialog {...defaultProps} />);
      
      const title = screen.getByText('Confirmer l\'action');
      expect(title).toHaveClass('text-text-primary');
    });

    it('should use text-text-secondary for message', () => {
      render(<ConfirmDialog {...defaultProps} />);
      
      const message = screen.getByText('Êtes-vous sûr de vouloir effectuer cette action ?');
      expect(message).toHaveClass('text-text-secondary');
    });

    it('should use border-border class for cancel button border', () => {
      render(<ConfirmDialog {...defaultProps} />);
      
      const cancelButton = screen.getByRole('button', { name: 'Annuler' });
      expect(cancelButton).toHaveClass('border-border');
    });
  });

  describe('Accessibility', () => {
    it('should be centered on screen', () => {
      render(<ConfirmDialog {...defaultProps} />);
      
      const overlay = screen.getByText('Confirmer l\'action').closest('div').parentElement;
      expect(overlay).toHaveClass('flex', 'items-center', 'justify-center');
    });

    it('should have proper z-index for modal', () => {
      render(<ConfirmDialog {...defaultProps} />);
      
      const overlay = screen.getByText('Confirmer l\'action').closest('div').parentElement;
      expect(overlay).toHaveClass('z-50');
    });

    it('should have semi-transparent overlay', () => {
      render(<ConfirmDialog {...defaultProps} />);
      
      const overlay = screen.getByText('Confirmer l\'action').closest('div').parentElement;
      expect(overlay).toHaveClass('bg-black/50');
    });
  });
});