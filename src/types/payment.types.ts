import { TIdea } from "./idea.types";
import { TUser } from "./user.types";

export type TPaidIdeaPurchase = {
  id: string;
  userId: string;
  user: TUser;
  ideaId: string;
  idea: TIdea;
  paymentId?: string;
  transactionStatus?: string;
  paymentUrl?: string;
  bankStatus?: string;
  spCode?: string;
  spMessage?: string;
  method?: string;
  createdAt: Date;
};
