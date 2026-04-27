export type CountryCode = 'india' | 'usa' | 'uk' | 'australia' | 'germany';
export type ViewId = 'chat' | 'lifecycle' | 'timeline' | 'quiz' | 'next-step';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface LifecycleStage {
  id: string;
  order: number;
  title: string;
  description: string;
  details: string;
  tips: string[];
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'done' | 'active' | 'upcoming';
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  tags: string[];
}

export interface ElectionData {
  code: CountryCode;
  name: string;
  authority: string;
  authorityUrl: string;
  lifecycle: LifecycleStage[];
  timeline: TimelineEvent[];
  faqs: FAQ[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
