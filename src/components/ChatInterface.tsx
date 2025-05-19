
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ChatMessage, { ChatMessageProps } from './ChatMessage';

const ChatInterface: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessageProps[]>([
    {
      role: 'assistant',
      content: 'Hola, soy tu asistente IA. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;
    
    const userMessage: ChatMessageProps = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Aquí es donde se integraría con el backend (n8n, supabase, etc.)
    // Por ahora simulamos una respuesta después de un pequeño delay
    setTimeout(() => {
      const botReply: ChatMessageProps = {
        role: 'assistant',
        content: '¡Gracias por tu mensaje! Esta es una respuesta simulada. En una implementación real, aquí se conectaría con n8n, IA y Supabase para procesar tu solicitud y brindarte una respuesta adecuada.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botReply]);
      setIsLoading(false);
    }, 1000);

    // Enfocar el textarea después de enviar
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <ChatMessage 
            key={index}
            content={msg.content}
            role={msg.role}
            timestamp={msg.timestamp}
          />
        ))}
        <div ref={messagesEndRef} />
        
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg rounded-tl-none">
              <div className="h-5 w-16 bg-muted-foreground/30 rounded"></div>
            </div>
          </div>
        )}
      </div>
      
      <div className="border-t p-4">
        <div className="flex items-end gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un mensaje..."
            className="min-h-[60px] resize-none rounded-lg"
            maxRows={4}
          />
          <Button 
            onClick={handleSend} 
            size="icon" 
            className="h-[60px] w-[60px] rounded-lg"
            disabled={isLoading || input.trim() === ''}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
