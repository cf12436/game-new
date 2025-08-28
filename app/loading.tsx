export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto bg-gaming-cyan/20 rounded-full flex items-center justify-center animate-pulse">
            <div className="text-2xl">🎮</div>
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl font-bold gradient-text mb-4">Loading Games...</h2>
        
        {/* Loading Bar */}
        <div className="w-64 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-gaming-cyan to-gaming-purple rounded-full animate-pulse"></div>
        </div>
        
        {/* Loading Dots */}
        <div className="flex justify-center space-x-2 mt-6">
          <div className="w-2 h-2 bg-gaming-cyan rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gaming-purple rounded-full animate-bounce delay-75"></div>
          <div className="w-2 h-2 bg-gaming-green rounded-full animate-bounce delay-150"></div>
        </div>
      </div>
    </div>
  );
}



