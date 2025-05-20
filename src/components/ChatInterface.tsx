
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import ChatMessage, { ChatMessageProps } from './ChatMessage';

const N8N_WEBHOOK_URL = 'https://5b5d-81-61-16-9.ngrok-free.app/webhook/6bf2d3f3-a419-417d-9451-b24a1240266b/chat';

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
  const { toast } = useToast();

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

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          timestamp: userMessage.timestamp.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Parse the response from n8n
      const data = await response.json();
      
      const botReply: ChatMessageProps = {
        role: 'assistant',
        content: data.sumary || data.reply || 'Acción completada' ,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botReply]);
    } catch (error) {
      console.error('Error connecting to n8n webhook:', error);
      
      // Add error message to chat
      const errorMessage: ChatMessageProps = {
        role: 'assistant',
        content: 'La acción no se ha podido llevar a cabo, lo siento',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servicio n8n. Verifica que el servidor esté funcionando.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      
      // Focus the textarea after sending
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    }
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
            disabled={isLoading}
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
