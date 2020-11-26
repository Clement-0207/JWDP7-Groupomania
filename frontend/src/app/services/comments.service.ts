import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Comment } from '../models/Comment.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  comments$ = new Subject<Comment[]>();

  constructor(private http: HttpClient,
    private auth: AuthService) { }

  getComments(postId: string) {
    this.http.get('http://localhost:3000/api/posts/' + postId + '/comments').subscribe(
      (comments: Comment[]) => {
        this.comments$.next(comments);
      },
      (error) => {
        this.comments$.next([]);
        console.error(error);
      }
    );
  }

  getCommentById(id: string, postId: string) {
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:3000/api/posts/' + postId + '/comments/' + id).subscribe(
        (comment: Comment) => {
          resolve(comment);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getCommentLikeById(id: string, postId: string, accountId: string) {
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:3000/api/posts/' + postId + '/comments/' + id + '/like?accountId=' + accountId).subscribe(
        (result: any) => {
          resolve(result);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  likeComment(accountId: string, commentId: string, postId: string, like: number) {
    return new Promise((resolve, reject) => {
      const data =
      {
        account_id: accountId,
        like: like
      }
      this.http.post('http://localhost:3000/api/posts/' + postId + '/comments/' + commentId + '/like', data).subscribe(
        (response: { message: string }) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  createComment(comment: Comment) {
    return new Promise((resolve, reject) => {
      const data =
      {
        comment_body: comment.comment_body,
        account_id: comment.account_id
      }
      this.http.post('http://localhost:3000/api/posts/' + comment.post_message_id + '/comments/', data).subscribe(
        (response: { message: string }) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  modifyComment(comment: Comment) {
    return new Promise((resolve, reject) => {
      const data =
      {
        comment_body: comment.comment_body,
        account_id: comment.account_id
      }
      this.http.put('http://localhost:3000/api/posts/' + comment.post_message_id + '/comments/' + comment.comment_id, data).subscribe(
        (response: { message: string }) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  deleteComment(id: string, postId: string) {
    return new Promise((resolve, reject) => {
      this.http.delete('http://localhost:3000/api/posts/' + postId + '/comments/' + id).subscribe(
        (response: { message: string }) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
}
