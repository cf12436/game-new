import Link from 'next/link';
import { FiHome, FiSearch } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-4">
      <div className="text-center max-w-lg mx-auto">
        {/* 404 Animation */}
        <div className="mb-8 relative">
          <div className="text-8xl md:text-9xl font-bold gradient-text opacity-20">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl animate-bounce">🎮</div>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Game Not Found
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Oops! The game you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="flex items-center space-x-2 bg-gaming-cyan hover:bg-gaming-cyan/80 text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <FiHome size={20} />
            <span>Back to Home</span>
          </Link>
          
          <Link
            href="/?search=true"
            className="flex items-center space-x-2 bg-gaming-purple/20 hover:bg-gaming-purple/30 text-gaming-purple border border-gaming-purple/50 px-6 py-3 rounded-lg transition-all duration-200"
          >
            <FiSearch size={20} />
            <span>Search Games</span>
          </Link>
        </div>

        {/* Popular Categories */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-gray-300 mb-4">
            Try browsing popular categories:
          </h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {['action', 'puzzle', 'racing', 'sports', 'adventure'].map((category) => (
              <Link
                key={category}
                href={`/category/${category}`}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm transition-all duration-200 capitalize"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}



