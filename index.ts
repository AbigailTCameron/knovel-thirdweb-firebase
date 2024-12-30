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
  created_at: string;
  hash: string
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
  commentId: string;
  createdAt: string;
}

export interface Notification {
  author_id: string;
  book_id: string;
  comment_uuid: string;
  message: string;
  is_read: boolean; 
  created_at: string; 
  id: string;
}