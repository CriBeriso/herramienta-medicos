
import React from 'react';
import { cn } from '@/lib/utils';

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessageProps {
  content: string;
  role: MessageRole;
  timestamp?: Date;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  content, 
  role, 
  timestamp = new Date() 
}) => {
  const isUser = role === 'user';

  return (
    <div className={cn(
      "flex w-full mb-4 animate-fade-in items-start",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "px-4 py-3 rounded-lg max-w-[85%] md:max-w-[75%]",
        isUser 
          ? "bg-primary text-primary-foreground rounded-tr-none" 
          : "bg-secondary text-secondary-foreground rounded-tl-none"
      )}>
        <p className="text-sm md:text-base whitespace-pre-wrap break-words">{content}</p>
        <div className={cn(
          "text-xs mt-1 text-right opacity-70",
          isUser ? "text-primary-foreground/80" : "text-secondary-foreground/70"
        )}>
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
