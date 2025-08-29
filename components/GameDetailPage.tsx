'use client';

import { useState, useEffect } from 'react';
import { Game } from '@/types/game';
import Link from 'next/link';
import Image from 'next/image';
import GameCard from './GameCard';
import LanguageSelector from './LanguageSelector';
import { FiArrowLeft, FiMaximize, FiMinimize, FiStar, FiCalendar, FiTag, FiHome } from 'react-icons/fi';

interface GameDetailPageProps {
  game: Game;
  relatedGames: Game[];
}

export default function GameDetailPage({ game, relatedGames }: GameDetailPageProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [translatedDescription, setTranslatedDescription] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  const toggleFullscreen = async () => {
    if (!isFullscreen) {
      // 进入全屏模式
      try {
        // 尝试使用浏览器原生全屏API
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        } else if ((document.documentElement as any).webkitRequestFullscreen) {
          await (document.documentElement as any).webkitRequestFullscreen();
        } else if ((document.documentElement as any).msRequestFullscreen) {
          await (document.documentElement as any).msRequestFullscreen();
        }
        setIsFullscreen(true);
      } catch (error) {
        // console.log('浏览器全屏API不可用，使用自定义全屏');
        setIsFullscreen(true);
      }
    } else {
      // 退出全屏模式
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
        setIsFullscreen(false);
      } catch (error) {
        // console.log('退出浏览器全屏失败，使用自定义退出');
        setIsFullscreen(false);
      }
    }
  };

  // 监听浏览器全屏状态变化和ESC键
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).msFullscreenElement
      );

      if (!isCurrentlyFullscreen && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatQualityScore = (score: number) => {
    return (score * 5).toFixed(1);
  };

  const getQualityColor = (score: number) => {
    if (score >= 0.8) return 'text-green-400';
    if (score >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const handleLanguageSelect = async (language: { code: string; name: string; nativeName: string }) => {
    if (!game.description) return;
    
    setIsTranslating(true);
    setSelectedLanguage(language.name);
    
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: game.description,
          targetLanguage: language.name,
        }),
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      setTranslatedDescription(data.translatedText);
    } catch (error) {
      console.error('Translation error:', error);
      setTranslatedDescription('Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const resetTranslation = () => {
    setTranslatedDescription('');
    setSelectedLanguage('');
  };

  return (
    <div className="min-h-screen bg-gradient-dark text-white">
      {/* Fixed Fullscreen Overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black">
          <div className="relative w-full h-full">
            <iframe
              src={game.url}
              className="w-full h-full border-0"
              allow="fullscreen *; autoplay *; encrypted-media *; gyroscope *; picture-in-picture *; camera *; microphone *; payment *; geolocation *"
              allowFullScreen
              title={game.title}
              loading="lazy"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation allow-top-navigation-by-user-activation"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-3 rounded-lg transition-all duration-200 z-10 backdrop-blur-sm"
              title="退出全屏"
            >
              <FiMinimize size={20} />
            </button>

            {/* ESC键提示 */}
            <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-2 rounded-lg text-sm backdrop-blur-sm">
              按 ESC 键退出全屏
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-gaming-dark/95 backdrop-blur-sm border-b border-gaming-purple/20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gaming-cyan hover:text-cyan-300 transition-colors"
              >
                <FiArrowLeft size={20} />
                <span>Back to Games</span>
              </Link>
              
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <FiHome size={18} />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link
                href="/"
                className="flex items-center space-x-2"
              >
                <svg viewBox="0 0 512 512" className="w-6 h-6 text-gaming-cyan">
                  <rect width="512" height="512" fill="currentColor" rx="80" ry="80" opacity="0.3"/>
                  <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontFamily="Arial" fontWeight="bold" fill="currentColor" fontSize="200" dy="0">GH</text>
                </svg>
                <span className="hidden sm:inline font-bold gradient-text">Game Hub</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Game Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Game Header */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{game.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center space-x-2 bg-gaming-purple/20 rounded-full px-3 py-1">
                  <FiTag className="text-gaming-purple" size={16} />
                  <span className="text-gaming-purple font-medium capitalize">{game.category}</span>
                </div>
                
                {game.quality_score && (
                  <div className="flex items-center space-x-2 bg-black/30 rounded-full px-3 py-1">
                    <FiStar className={getQualityColor(game.quality_score)} size={16} />
                    <span className={`font-medium ${getQualityColor(game.quality_score)}`}>
                      {formatQualityScore(game.quality_score)} / 5.0
                    </span>
                  </div>
                )}
                
                {game.date_published && (
                  <div className="flex items-center space-x-2 text-gray-400">
                    <FiCalendar size={16} />
                    <span className="text-sm">{formatDate(game.date_published)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Game Player */}
            <div className="relative bg-black rounded-lg overflow-hidden">
              <div className="aspect-video w-full">
                <iframe
                  src={game.url}
                  className="w-full h-full border-0"
                  allow="fullscreen *; autoplay *; encrypted-media *; gyroscope *; picture-in-picture *; camera *; microphone *; payment *; geolocation *"
                  allowFullScreen
                  title={game.title}
                  loading="lazy"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation allow-top-navigation-by-user-activation"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <button
                onClick={toggleFullscreen}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-all duration-200 backdrop-blur-sm"
                title="全屏播放"
              >
                <FiMaximize size={18} />
              </button>
            </div>

            {/* Game Description */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">About This Game</h2>
                <div className="flex items-center space-x-3">
                  {translatedDescription && (
                    <button
                      onClick={resetTranslation}
                      className="text-sm text-gaming-cyan hover:text-cyan-300 transition-colors"
                    >
                      Show Original
                    </button>
                  )}
                  <LanguageSelector 
                    onLanguageSelect={handleLanguageSelect}
                    isTranslating={isTranslating}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                {isTranslating ? (
                  <div className="flex items-center space-x-3 text-gaming-purple">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gaming-purple"></div>
                    <span>Translating to {selectedLanguage}...</span>
                  </div>
                ) : translatedDescription ? (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm text-gaming-purple font-medium">
                        Translated to {selectedLanguage}:
                      </span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{translatedDescription}</p>
                  </div>
                ) : (
                  <p className="text-gray-300 leading-relaxed">{game.description}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <div className="text-sm text-gray-400">Orientation</div>
                  <div className="font-medium capitalize">{game.orientation}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Resolution</div>
                  <div className="font-medium">{game.width} × {game.height}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Published</div>
                  <div className="font-medium">{game.date_published ? formatDate(game.date_published) : 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Last Updated</div>
                  <div className="font-medium">{game.date_modified ? formatDate(game.date_modified) : 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Related Games */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-gaming-cyan to-gaming-purple rounded-full"></div>
                  <h2 className="text-xl font-semibold gradient-text">More {game.category} Games</h2>
                </div>
                
                {relatedGames.length > 0 ? (
                  <div className="space-y-3">
                    {relatedGames.slice(0, 6).map((relatedGame, index) => (
                      <Link 
                        key={relatedGame.id} 
                        href={`/game/${relatedGame.namespace}`}
                        className="group block"
                      >
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 border border-transparent hover:border-gaming-cyan/30">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={relatedGame.banner_image}
                              alt={relatedGame.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                              sizes="64px"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-white group-hover:text-gaming-cyan transition-colors duration-200 truncate">
                              {relatedGame.title}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                              {relatedGame.quality_score && (
                                <div className="flex items-center space-x-1">
                                  <FiStar className="text-yellow-400" size={12} />
                                  <span className="text-xs text-gray-400">
                                    {(relatedGame.quality_score * 5).toFixed(1)}
                                  </span>
                                </div>
                              )}
                              <span className="text-xs text-gray-500 capitalize">{relatedGame.category}</span>
                            </div>
                          </div>
                          <div className="text-gaming-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    ))}
                    
                    {relatedGames.length > 6 && (
                      <Link
                        href={`/category/${game.category}`}
                        className="block w-full mt-4 py-3 text-center bg-gradient-to-r from-gaming-cyan/20 to-gaming-purple/20 hover:from-gaming-cyan/30 hover:to-gaming-purple/30 rounded-lg transition-all duration-200 text-gaming-cyan font-medium border border-gaming-cyan/30 hover:border-gaming-cyan/50"
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <span>View All {game.category} Games</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gaming-purple/20 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gaming-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <p className="text-gray-400 mb-3">No related games found</p>
                    <Link
                      href="/"
                      className="inline-flex items-center space-x-2 text-gaming-cyan hover:text-cyan-300 transition-colors font-medium"
                    >
                      <span>Browse all games</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



