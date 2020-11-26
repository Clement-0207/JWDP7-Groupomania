import { Comment } from '../models/Comment.model';

export class Post {
  post_id: string;
  title: string;
  body: string;
  written_on: Date;
  formattedDate: string;
  comments: Comment[];
  account_id: string;
  likes: number;
  dislikes: number;
  name: string;
}
