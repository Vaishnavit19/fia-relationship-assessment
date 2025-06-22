// lib/gemini-types.ts

export interface GeminiRequest {
  message: string;
  model?: string;
  config?: GeminiConfig;
}

export interface GeminiConfig {
  maxOutputTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
  stopSequences?: string[];
  systemInstruction?: string;
}

export interface GeminiResponse {
  text: string;
  success: boolean;
  error?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface ChatHistory {
  messages: ChatMessage[];
}

export interface StreamChunk {
  text: string;
  done: boolean;
}

export interface UseGeminiReturn {
  generateContent: (message: string, model?: string, config?: GeminiConfig) => Promise<string>;
  generateContentStream: (
    message: string,
    model?: string,
    config?: GeminiConfig
  ) => Promise<ReadableStream<Uint8Array>>;
  createChat: (history?: ChatMessage[]) => ChatInstance;
  loading: boolean;
  error: string | null;
}

export interface ChatInstance {
  sendMessage: (message: string) => Promise<string>;
  sendMessageStream: (message: string) => Promise<ReadableStream<Uint8Array>>;
  getHistory: () => ChatMessage[];
  clearHistory: () => void;
}
