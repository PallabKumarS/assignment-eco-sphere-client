import { TIdea } from "./idea.types";
import { TUser } from "./user.types";

export type TComment = {
  id: string;
  content: string;
  userId: string;
  user: TUser;
  ideaId: string;
  idea: TIdea;
  parentId?: string;
  parent?: Comment;
  replies: TComment[];
  createdAt: Date;
  updatedAt: Date;
};
