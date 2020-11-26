import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from '../models/Post.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  posts$ = new Subject<Post[]>();

  constructor(private http: HttpClient,
    private auth: AuthService) { }

  getPosts() {
    this.http.get('http://localhost:3000/api/posts').subscribe(
      (posts: Post[]) => {
        this.posts$.next(posts);
      },
      (error) => {
        this.posts$.next([]);
        console.error(error);
      }
    );
  }

  getPostById(id: string) {
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:3000/api/posts/' + id).subscribe(
        (post: Post) => {
          resolve(post);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getPostLikeById(id: string, accountId: string) {
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:3000/api/posts/' + id + '/like?accountId=' + accountId).subscribe(
        (result: any) => {
          resolve(result);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  createPost(post: Post) {
    return new Promise((resolve, reject) => {
      const data =
      {
        title: post.title,
        body: post.body,
        account_id: post.account_id
      }
      this.http.post('http://localhost:3000/api/posts', data).subscribe(
        (response: { message: string }) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  likePost(accountId: string, postId: string, like: number) {
    return new Promise((resolve, reject) => {
      const data = {
        account_id: accountId,
        like: like
      }
      this.http.post('http://localhost:3000/api/posts/' + postId + '/like', data).subscribe(
        (response: any) => {
          resolve(response);
        },
        (error) => {
          console.log('error');
          reject(error);
        }
      );
    });
  }

  modifyPost(id: string, post: Post) {
    return new Promise((resolve, reject) => {
      const data =
      {
        title: post.title,
        body: post.body,
        account_id: post.account_id
      }
      this.http.put('http://localhost:3000/api/posts/' + id, data).subscribe(
        (response: { message: string }) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  deletePost(id: string) {
    return new Promise((resolve, reject) => {
      this.http.delete('http://localhost:3000/api/posts/' + id).subscribe(
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
