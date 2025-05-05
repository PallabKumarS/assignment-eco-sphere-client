import { TIdea } from "./idea.types";

export interface TCategory {
  id: string;
  name: string;
  ideas?: TIdea[];
}
