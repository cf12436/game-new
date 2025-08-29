'use client';

import { useState, useEffect } from 'react';
import { GameCategory } from '@/types/game';
import { FiChevronRight, FiFilter } from 'react-icons/fi';
import categories from '@/category.json';

interface CategorySidebarProps {
  isOpen: boolean;
  selectedCategory?: string;
  onCategorySelect: (category: string) => void;
  onClose: () => void;
  onToggle: () => void;
}

export default function CategorySidebar({ 
  isOpen, 
  selectedCategory, 
  onCategorySelect, 
  onClose,
  onToggle
}: CategorySidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState<GameCategory[]>(categories);

  useEffect(() => {
    if (searchTerm) {
      const filtered = categories.filter(category =>
        category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.tagNamespace.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [searchTerm]);

  const handleCategoryClick = (category: string) => {
    onCategorySelect(category);
    // On mobile, close sidebar after selection
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Tab - Always visible when closed */}
      {!isOpen && (
        <div
          data-sidebar-tab
          className="fixed top-1/2 left-0 transform -translate-y-1/2 z-40 cursor-pointer group"
          onClick={onToggle}
        >
          <div className="bg-gaming-purple/80 backdrop-blur-sm border border-gaming-purple/30 rounded-r-lg px-2 py-6 shadow-lg transition-all duration-300 hover:bg-gaming-purple/90 hover:px-3 hover:shadow-xl">
            <div className="flex flex-col items-center space-y-3">
              <FiFilter className="text-white group-hover:scale-110 transition-transform duration-200" size={20} />
              <div className="flex flex-col items-center space-y-1">
                {['C', 'A', 'T', 'E', 'G', 'O', 'R', 'I', 'E', 'S'].map((letter, index) => (
                  <span key={index} className="text-xs text-white font-medium tracking-wider">
                    {letter}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div
        data-sidebar
        className={`fixed top-20 left-0 h-[calc(100vh-80px)] w-80 bg-gaming-dark/95 backdrop-blur-sm border-r border-gaming-purple/20 z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isOpen ? 'md:translate-x-0' : 'md:-translate-x-full'}`}
        onMouseEnter={() => {
          // 保持侧边栏打开状态当鼠标悬停在上面
        }}
      >
        <div className="p-4 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-6 pt-4">
            <FiFilter className="text-gaming-cyan" size={20} />
            <h2 className="text-lg font-semibold text-white">Categories</h2>
          </div>

          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gaming-cyan/30 focus:border-gaming-cyan/50"
            />
          </div>

          {/* All Games Button */}
          <button
            onClick={() => handleCategoryClick('')}
            className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-all duration-200 flex items-center justify-between group ${
              !selectedCategory
                ? 'bg-gaming-cyan/20 text-gaming-cyan border border-gaming-cyan/30'
                : 'hover:bg-white/10 text-gray-300 hover:text-white'
            }`}
          >
            <span className="font-medium">All Games</span>
            <FiChevronRight
              className={`transition-transform duration-200 ${
                !selectedCategory ? 'rotate-90' : 'group-hover:translate-x-1'
              }`}
              size={16}
            />
          </button>

          {/* Categories List */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-2 scrollbar-thin scrollbar-thumb-gaming-cyan/30 scrollbar-track-transparent">
            {filteredCategories.map((category) => (
              <button
                key={category.tagNamespace}
                onClick={() => handleCategoryClick(category.tagNamespace)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                  selectedCategory === category.tagNamespace
                    ? 'bg-gaming-purple/20 text-gaming-purple border border-gaming-purple/30'
                    : 'hover:bg-white/10 text-gray-300 hover:text-white'
                }`}
              >
                <span className="capitalize">{category.title}</span>
                <FiChevronRight
                  className={`transition-transform duration-200 ${
                    selectedCategory === category.tagNamespace ? 'rotate-90' : 'group-hover:translate-x-1'
                  }`}
                  size={16}
                />
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gaming-purple/20">
            <p className="text-xs text-gray-400 text-center">
              {filteredCategories.length} categories available
            </p>
          </div>
        </div>
      </div>
    </>
  );
}



