export type TComment = {
  id:       string;
  content:  string;
  user: {
    id: string;
    name: string;
  };
  userId:   string;
  ideaId:   string;
  parentId?: string;
  replies?:  TComment[];

  createdAt: string;
  updatedAt: string;
}

