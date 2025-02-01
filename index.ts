
// types/index.ts
export interface Book {
  id: string;
  title: string;
  author: string;
  book_image: string;
  synopsis: string;
  genres: string[];
  finished: boolean;
  rating: number;
  verified: boolean;
  created_at: any;
  hash: string;
  views: number;
  price: number;
  currency: string;
}

export interface BookMetadata {
  title: string;
  creator: string;
  language: string;
  rights: string;
  description: string;
  pubdate:string;
}

export interface BookChapters {
  title: string;
  href: string;
}

export interface DraftChapters {
  title: string;
  content: string; 
  completed: boolean;
  createdAt: string;
  published: boolean;
}

export interface Comment {
  commenter: string;
  comment: string; 
  id: string;
  createdAt: string;
}

export interface User {
  name: string;
  profilePicture: string;
  created_at: any;
  bookmark: string[];
  drafts: string[];
  published: string[];
}

export interface Notification {
  id: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}