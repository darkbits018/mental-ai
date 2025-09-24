export function LoadingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="max-w-xs sm:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl text-sm sm:text-base bg-white text-gray-800 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-gray-500">Thinking...</span>
        </div>
      </div>
    </div>
  );
}