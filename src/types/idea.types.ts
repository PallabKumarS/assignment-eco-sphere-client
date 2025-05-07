import { TCategory } from "./category.types";
import { TVote } from "./vote.types";

export type TIdea = {
  id: string;
  title: string;
  problem: string;
  solution: string;
  description: string;
  images: string[];
  price: number;
  categories: string[];
  status: TIdeaStatus;
  comments: string[];
  feedback?: string;
  authorId: string;
  isPaid: boolean;
  category: TCategory;
  votes?: TVote[];
};

export interface IIdea {
  id: string;
  title: string;
  problem: string;
  solution: string;
  description: string;
  images: string[]; // Array of image URLs
  isPaid: boolean;
  price: number;
  categories: {
    id: string;
    name: string;
  }[];
  createdAt?: string; // optional timestamps
  updatedAt?: string;
}


type TIdeaStatus =
  | "DRAFT"
  | "PENDING"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED";
