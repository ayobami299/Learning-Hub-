export interface Module {
  id: string;
  title: string;
  description: string;
  concept: string;
  badge: string;
  emoji: string;
  color: string; // Tailwind tint class (e.g., 'indigo', 'emerald')
}

export interface Block {
  id: number;
  timestamp: string;
  data: string;
  hash: string;
  prevHash: string;
  nonce: number;
  isTampered?: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  analogy: string;
  options: {
    key: string;
    text: string;
  }[];
  correctAnswer: string;
  explanation: string;
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  balance: string;
  network: string;
}
