import { TCategory } from "./category.types";
import { TComment } from "./comment.types";
import { TUser } from "./user.types";
import { TVote } from "./vote.types";

export type TIdea = {
  id: string;
  title: string;
  problem: string;
  solution: string;
  description: string;
  images: string[];
  status: IdeaStatus;
  feedback?: string;
  isPaid: boolean;
  price?: number;
  categories: TCategory[];
  authorId: string;
  users: TUser;
  votes: TVote[];
  comments: TComment[];
  paidIdeaPurchase: TPaidIdeaPurchase[];
  createdAt: Date;
  updatedAt: Date;
};
export type TPaidIdeaPurchase = {
  id: string;
  userId: string;
  user: TUser;
  ideaId: string;
  idea: TIdea;
  createdAt: Date;
};

export enum IdeaStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  UNDER_REVIEW = "UNDER_REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}
