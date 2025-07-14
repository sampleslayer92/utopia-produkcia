import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export const useChatBot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const threadIdRef = useRef<string | null>(null);

  const addMessage = useCallback((content: string, isUser: boolean) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      isUser,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
    
    if (!isUser && !isOpen) {
      setHasNewMessage(true);
    }
  }, [isOpen]);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    addMessage(message, true);

    try {
      const { data, error } = await supabase.functions.invoke('openai-assistant-chat', {
        body: {
          message: message.trim(),
          threadId: threadIdRef.current,
        },
      });

      if (error) {
        throw error;
      }

      if (data.threadId) {
        threadIdRef.current = data.threadId;
      }

      addMessage(data.reply, false);
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage('Prepáčte, došlo k chybe pri spracovaní vašej správy. Skúste to prosím znovu.', false);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, addMessage]);

  const toggleChatBot = useCallback(() => {
    setIsOpen(prev => {
      if (!prev) {
        setHasNewMessage(false);
      }
      return !prev;
    });
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    threadIdRef.current = null;
  }, []);

  return {
    messages,
    isOpen,
    isLoading,
    hasNewMessage,
    sendMessage,
    toggleChatBot,
    clearMessages,
  };
};