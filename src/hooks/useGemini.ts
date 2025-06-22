// hooks/useGemini.ts

import { useState, useCallback } from 'react';

import type { UseGeminiReturn, GeminiConfig, GeminiResponse } from '@/types/gemini';

export function useGemini(): UseGeminiReturn {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateContent = useCallback(
    async (message: string, model = 'gemini-1.5-flash', config?: GeminiConfig): Promise<string> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/gemini', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message, model, config }),
        });

        const data: GeminiResponse = await response.json();

        if (!data.success) {
          throw new Error(data.error ?? 'Failed to generate content');
        }

        return data.text;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // const generateContentStream = useCallback(
  //   async (
  //     message: string,
  //     model = 'gemini-1.5-flash',
  //     config?: GeminiConfig
  //   ): Promise<ReadableStream<Uint8Array>> => {
  //     setLoading(true);
  //     setError(null);

  //     try {
  //       const response = await fetch('/api/gemini/stream', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ message, model, config }),
  //       });

  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }

  //       if (!response.body) {
  //         throw new Error('No response body received');
  //       }

  //       return response.body;
  //     } catch (err) {
  //       const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
  //       setError(errorMessage);
  //       throw new Error(errorMessage);
  //     } finally {
  //       setLoading(false);
  //     }
  //   },
  //   []
  // );

  // const createChat = useCallback(
  //   (history: ChatMessage[] = []): ChatInstance => {
  //     let chatHistory = [...history];

  //     return {
  //       sendMessage: async (message: string): Promise<string> => {
  //         setLoading(true);
  //         setError(null);

  //         try {
  //           const response = await fetch('/api/gemini/chat', {
  //             method: 'POST',
  //             headers: {
  //               'Content-Type': 'application/json',
  //             },
  //             body: JSON.stringify({ message, history: chatHistory }),
  //           });

  //           const data: GeminiResponse = await response.json();

  //           if (!data.success) {
  //             throw new Error(data.error || 'Failed to send chat message');
  //           }

  //           // Update chat history
  //           chatHistory.push(
  //             { role: 'user', parts: [{ text: message }] },
  //             { role: 'model', parts: [{ text: data.text }] }
  //           );

  //           return data.text;
  //         } catch (err) {
  //           const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
  //           setError(errorMessage);
  //           throw new Error(errorMessage);
  //         } finally {
  //           setLoading(false);
  //         }
  //       },

  //       sendMessageStream: async (message: string): Promise<ReadableStream<Uint8Array>> => {
  //         // For streaming chat, you'd need to create a separate endpoint
  //         // This is a simplified version
  //         return generateContentStream(message);
  //       },

  //       getHistory: (): ChatMessage[] => {
  //         return [...chatHistory];
  //       },

  //       clearHistory: (): void => {
  //         chatHistory = [];
  //       },
  //     };
  //   },
  //   [generateContentStream]
  // );

  return {
    generateContent,
    // generateContentStream,
    // createChat,
    loading,
    error,
  };
}
