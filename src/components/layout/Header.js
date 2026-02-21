/**
 * Header Component
 * 
 * Main header for the application.
 * As specified in specs/UI_guidelines.md
 */

import Link from 'next/link';

export default function Header({ title, showAdmin = false }) {
  return (
    <header className="bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-page-title text-text-primary">
          {title}
        </h1>
        
        {showAdmin && (
          <Link
            href="/admin"
            className="btn-primary"
          >
            Admin
          </Link>
        )}
      </div>
    </header>
  );
}