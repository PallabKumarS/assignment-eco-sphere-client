import { TComment } from "@/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function buildCommentTree(flatComments: TComment[]): TComment[] {
  const commentMap: Record<string, TComment> = {};
  const tree: TComment[] = [];

  flatComments.forEach((comment) => {
    commentMap[comment.id] = { ...comment, replies: [] };
  });

  flatComments.forEach((comment) => {
    if (comment.parentId) {
      commentMap[comment.parentId]?.replies?.push(commentMap[comment.id]);
    } else {
      tree.push(commentMap[comment.id]);
    }
  });

  return tree;
}
