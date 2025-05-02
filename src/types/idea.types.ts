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
};

export interface IIdea {
  title: string;
  problem: string;
  solution: string;
  description: string;
  images: string[];
  price: number;
  categories: string[];
  isPaid?: boolean;
}

type TIdeaStatus =
  | "DRAFT"
  | "PENDING"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED";
