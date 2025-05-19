
import React from 'react';
import Header from '@/components/Header';
import ChatInterface from '@/components/ChatInterface';

const Index = () => {
  return (
    <div className="flex flex-col h-screen bg-background">
      <Header 
        title="Asistente IA" 
        subtitle="Integrado con n8n y Supabase" 
      />
      
      <main className="flex-1 container mx-auto flex flex-col overflow-hidden max-w-3xl">
        <ChatInterface />
      </main>
      
      <footer className="py-2 px-4 text-center text-xs text-muted-foreground border-t">
        <p>© {new Date().getFullYear()} - Interfaz de Asistente IA</p>
      </footer>
    </div>
  );
};

export default Index;
