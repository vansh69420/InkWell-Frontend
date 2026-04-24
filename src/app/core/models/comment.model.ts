export interface CommentResponse {
  commentId: string;
  postId: string;
  authorId: string;
  authorUsername: string;
  authorFullName: string;
  parentCommentId: string | null;
  content: string;
  likesCount: number;
  isLikedByCurrentUser: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  replies: CommentResponse[];
}

export interface AddCommentRequest {
  postId: string;
  parentCommentId: string | null;
  content: string;
}

export interface UpdateCommentRequest {
  content: string;
}
