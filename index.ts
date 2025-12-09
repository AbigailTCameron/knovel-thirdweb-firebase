
// types/index.ts
import { NavItem } from "epubjs";

export interface EpubThemes {
  register: (name: string, styles: Record<string, unknown>) => void;
  select: (name: string) => void;
  fontSize: (size: string) => void;
}
export interface EpubNavigation {
  toc?: NavItem[];
  // other fields we don't care about can be left as unknown
  [key: string]: unknown;
}
export interface EpubLoaded {
  metadata: Promise<Record<string, unknown>>;
  navigation: Promise<EpubNavigation>;
  spine?: Promise<unknown>;
  // other keys we don't use:
  [key: string]: unknown;
}

export interface EpubRenderOptions {
  width?: number | string;
  height?: number | string;
  flow?: "paginated" | "scrolled-doc" | "scrolled-continuous";
  spread?: "auto" | "none" | "always";
  [key: string]: unknown;
}

export interface EpubAnnotations {
  add: (
    type: string,
    cfiRange: string,
    data?: unknown,
    cb?: ((e: unknown) => void) | null,
    className?: string,
    styles?: Record<string, unknown>
  ) => void;
}

export interface EpubRendition {
  display(target?: string): Promise<void> | void;
  next(): Promise<void> | void;
  prev(): Promise<void> | void;
  on(event: string, cb: (...args: unknown[]) => void): void;
  off?: (event: string, cb: (...args: unknown[]) => void) => void;
  destroy?(): void;
  themes?: EpubThemes;
  annotations?: EpubAnnotations;
  [key: string]: unknown;
}

// types/EpubBook.ts
export interface EpubBook {
  ready: Promise<unknown>;
  loaded: EpubLoaded;
  navigation?: EpubNavigation;
  renderTo?: (element: HTMLElement, options: EpubRenderOptions) => EpubRendition;
  coverUrl?: () => Promise<string>;
  destroy?: () => void;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  authorId: string;
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
  chapters: string[];
  trendingScore: number;
}

export interface BookMetadata {
  title: string;
  creator: string;
  language: string;
  rights: string;
  description: string;
  pubdate:string;
  cover: string;
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

export interface SearchedUser {
  id: string;
  name: string;
  username: string;
  profilePicture: string;
  bookmark: string[];
  verified: boolean;
  drafts: string[];
  published: string[];
  isFollowing: boolean;
}

export interface Notification {
  id: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  commenterProfile: string;
  bookImage: string;
  bookId: string;
}