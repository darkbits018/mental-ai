interface MessageInputProps {
  input: string;
  setInput: (input: string) => void;
  sendMessage: () => void;
  isLoading: boolean;
}

export function MessageInput({ input, setInput, sendMessage, isLoading }: MessageInputProps) {
  return (
    <input
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
      placeholder="Type a message..."
      disabled={isLoading}
      className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  );
}