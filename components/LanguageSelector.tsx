'use client';

import { useState } from 'react';
import { FiGlobe, FiChevronDown } from 'react-icons/fi';

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const languages: Language[] = [
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski' },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu' },
  { code: 'tl', name: 'Filipino', nativeName: 'Filipino' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی' },
];

interface LanguageSelectorProps {
  onLanguageSelect: (language: Language) => void;
  isTranslating?: boolean;
}

export default function LanguageSelector({ onLanguageSelect, isTranslating }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLanguageSelect = (language: Language) => {
    onLanguageSelect(language);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isTranslating}
        className={`flex items-center space-x-2 px-4 py-2 bg-gaming-purple/20 hover:bg-gaming-purple/30 border border-gaming-purple/30 rounded-lg transition-all duration-200 ${
          isTranslating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <FiGlobe className="text-gaming-purple" size={18} />
        <span className="text-white font-medium">
          {isTranslating ? 'Translating...' : 'Translate'}
        </span>
        <FiChevronDown 
          className={`text-gaming-purple transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
          size={16} 
        />
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-2 w-80 bg-gaming-dark/95 backdrop-blur-sm border border-gaming-purple/30 rounded-lg shadow-xl z-50">
            {/* Search */}
            <div className="p-3 border-b border-gaming-purple/20">
              <input
                type="text"
                placeholder="Search languages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gaming-purple/30 focus:border-gaming-purple/50"
                autoFocus
              />
            </div>

            {/* Language List */}
            <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gaming-purple/30 scrollbar-track-transparent">
              {filteredLanguages.length > 0 ? (
                filteredLanguages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageSelect(language)}
                    className="w-full text-left px-4 py-3 hover:bg-gaming-purple/20 transition-colors duration-200 border-b border-gaming-purple/10 last:border-b-0"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{language.name}</span>
                      <span className="text-gaming-purple text-sm">{language.nativeName}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-400 text-center">
                  No languages found
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
