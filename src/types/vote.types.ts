import { TIdea } from "./idea.types";
import { TUser } from "./user.types";

export type TVote = {
  id: string;
  userId: string;
  user: TUser;
  ideaId: string;
  idea: TIdea;
  type: VoteType;
  createdAt: Date;
  updatedAt: Date;
};

export enum VoteType {
  UPVOTE = "UPVOTE",
  DOWNVOTE = "DOWNVOTE",
}
