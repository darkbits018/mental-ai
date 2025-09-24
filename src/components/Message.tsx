import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export interface MessageProps {
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export function Message({ text, isBot, timestamp }: MessageProps) {
  return (
    <div className={`flex flex-col group ${isBot ? 'items-start' : 'items-end'}`}>
      <div className={`flex items-center gap-2 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        <div
          className={`max-w-xs sm:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl text-sm sm:text-base ${isBot
            ? 'bg-white text-gray-800 shadow-sm border border-gray-100'
            : 'bg-blue-500 text-white shadow-sm'
            }`}
        >
          {isBot ? (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ node, ...props }) => <p className="my-2" {...props} />,
                  strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                  a: ({ node, ...props }) => <a className="text-blue-600 hover:underline break-all" target="_blank" rel="noopener noreferrer" {...props} />,
                }}
              >
                {text}
              </ReactMarkdown>
            </div>
          ) : (
            text
          )}
        </div>
      </div>
      <div className="px-2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
      </div>
    </div>
  );
}