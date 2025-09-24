import { Message } from './Message';
import { LoadingIndicator } from './LoadingIndicator';
import { Message as MessageType } from '../types';

interface MessageListProps {
  messages: MessageType[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {messages.map((msg, i) => (
          <Message key={i} text={msg.text} isBot={msg.isBot} timestamp={msg.timestamp} />
        ))}
        {isLoading && <LoadingIndicator />}
      </div>
    </div>
  );
}