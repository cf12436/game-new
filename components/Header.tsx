'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FiSearch, FiMenu, FiX, FiHome } from 'react-icons/fi';

interface HeaderProps {
  onSearchChange?: (query: string) => void;
  onCategoryToggle?: () => void;
  isCategoryOpen?: boolean;
}

export default function Header({ onSearchChange, onCategoryToggle, isCategoryOpen }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChange?.(query);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange?.(searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 bg-gaming-dark/95 backdrop-blur-sm border-b border-gaming-purple/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-6">
            {/* Category Toggle Button */}
            <button
              onClick={onCategoryToggle}
              className="p-2 rounded-lg bg-gaming-purple/20 hover:bg-gaming-purple/30 transition-colors duration-200"
              aria-label="Toggle categories"
            >
              {isCategoryOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
            
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-10 h-10 bg-gaming-cyan/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <svg viewBox="0 0 512 512" className="w-6 h-6 text-gaming-cyan">
                  <rect width="512" height="512" fill="currentColor" rx="80" ry="80" opacity="0.3"/>
                  <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontFamily="Arial" fontWeight="bold" fill="currentColor" fontSize="200" dy="0">GH</text>
                </svg>
              </div>
              <span className="text-xl font-bold gradient-text">Game Hub</span>
            </Link>

            {/* Home Button */}
            <Link
              href="/"
              className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg bg-gaming-cyan/20 hover:bg-gaming-cyan/30 transition-colors duration-200 text-gaming-cyan"
            >
              <FiHome size={18} />
              <span>Home</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-6">
            <form onSubmit={handleSearchSubmit} className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={`w-full pl-10 pr-20 py-2 bg-white/10 backdrop-blur-sm border rounded-lg transition-all duration-200 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                  isSearchFocused 
                    ? 'border-gaming-cyan/50 focus:ring-gaming-cyan/30 bg-white/15' 
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              />
              <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      onSearchChange?.('');
                    }}
                    className="p-1 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <FiX size={14} />
                  </button>
                )}
                <button
                  type="submit"
                  className="px-2 py-1 bg-gaming-cyan/20 hover:bg-gaming-cyan/30 text-gaming-cyan rounded transition-colors duration-200"
                >
                  <FiSearch size={14} />
                </button>
              </div>
            </form>
          </div>

          {/* Mobile Home Button */}
          <Link
            href="/"
            className="md:hidden p-2 rounded-lg bg-gaming-cyan/20 hover:bg-gaming-cyan/30 transition-colors duration-200 text-gaming-cyan"
          >
            <FiHome size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
}
