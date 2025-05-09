import { TIdea } from "./idea.types";
import { TUser } from "./user.types";

export type TPaidIdeaPurchase = {
  id: string;
  userId: string;
  user: TUser;
  ideaId: string;
  idea: TIdea;
  paymentId?: string;
  amount: number;
  transactionStatus?: "PENDING" | "PAID" | "CANCELLED";
  paymentUrl?: string;
  transactionId?: string;
  paidAt: Date;
  method: string;
  createdAt: Date;
};
