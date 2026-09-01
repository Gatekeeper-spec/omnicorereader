import type { Format, Priority, SelectionMode, Status, UnitType } from "./formats";

export type Profile = {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string;
  seeded: boolean;
};

export type Book = {
  id: string;
  userId: string;
  title: string;
  author: string;
  isbn: string | null;
  coverUrl: string | null;
  format: Format;
  genre: string | null;
  publisher: string | null;
  year: number | null;
  totalUnits: number;
  unitType: UnitType;
  status: Status;
  progress: number;
  ongoing: boolean;
  rating: number | null;
  review: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  lastLocation: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type WishlistItem = {
  id: string;
  userId: string;
  title: string;
  author: string;
  isbn: string | null;
  coverUrl: string | null;
  format: Format | null;
  priority: Priority;
  estimatedPrice: number | null;
  notes: string | null;
  createdAt: string;
};

export type ReadingSession = {
  id: string;
  userId: string;
  bookId: string;
  startedAt: string;
  durationSec: number;
  unitsRead: number;
  day: string;
};

export type Club = {
  id: string;
  name: string;
  description: string;
  inviteCode: string;
  ownerId: string;
  selectionMode: SelectionMode;
  memberLimit: number;
  createdAt: string;
  role: "owner" | "admin" | "member";
  memberCount: number;
};

export type ClubMember = {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  role: "owner" | "admin" | "member";
  joinedAt: string;
};

export type ClubWork = {
  id: string;
  clubId: string;
  title: string;
  author: string;
  coverUrl: string | null;
  isbn: string | null;
  format: Format;
  totalUnits: number;
  unitType: UnitType;
  synopsis: string;
  status: "nominated" | "current" | "archived";
  nominatedBy: string;
  nominatedByName: string;
  startedAt: string | null;
  finishedAt: string | null;
  createdAt: string;
  voteCount: number;
  votedByMe: boolean;
};

export type ClubProgressRow = {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  progress: number;
  updatedAt: string | null;
};

export type ClubPost = {
  id: string;
  clubId: string;
  workId: string | null;
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  body: string;
  spoiler: boolean;
  createdAt: string;
};

export type CatalogHit = {
  title: string;
  author: string;
  isbn: string | null;
  coverUrl: string | null;
  year: number | null;
  publisher: string | null;
  pageCount: number | null;
  synopsis: string | null;
  categories: string[];
};

export type Analytics = {
  pages: number;
  chapters: number;
  minutes: number;
  booksFinished: number;
  booksReading: number;
  streak: number;
  bestStreak: number;
  sessionsThisWeek: number;
  minutesThisWeek: number;
  byFormat: { format: Format; count: number }[];
  byGenre: { genre: string; count: number }[];
  byAuthor: { author: string; count: number }[];
  last14: { day: string; minutes: number; units: number }[];
};
