import { Component, OnInit } from '@angular/core';
import { Post } from '../models/Post.model';
import { Comment } from '../models/Comment.model';
import { PostsService } from '../services/posts.service';
import { CommentsService } from '../services/comments.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss']
})
export class SinglePostComponent implements OnInit {

  commentSub: Subscription;
  loading: boolean;
  post: Post;
  comments: Comment[];
  userId: string;
  errorMessage: string;
  liked: boolean;
  disliked: boolean;
  likePending: boolean;
  isAdmin: boolean;

  constructor(private postsService: PostsService,
    private commentsService: CommentsService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router,
    public datepipe: DatePipe) { }

  ngOnInit() {
    this.isAdmin = this.auth.getIsAdmin();
    this.commentSub = this.commentsService.comments$.subscribe(
      (comments) => {
        this.comments = comments;
        this.loading = false;
        this.errorMessage = null;
      },
      (error) => {
        this.errorMessage = JSON.stringify(error);
        this.loading = false;
      }
    );

    this.userId = this.auth.getUserId();
    this.loading = true;
    this.route.params.subscribe(
      (params) => {
        this.postsService.getPostById(params.id).then(
          (post: Post) => {
            this.post = post;
            this.commentsService.getComments(post.post_id);
            this.postsService.getPostLikeById(this.post.post_id, this.userId).then(
              (result: any) => {
                if (result.result === 1 && result.like === 1) {
                  this.liked = true;
                } else if (result.result === 1 && result.like === 0) {
                  this.disliked = true;
                }
              }
            );
          }
        );
      }
    );
    this.userId = this.auth.getUserId();
  }

  onBack() {
    this.router.navigate(['/posts']);
  }

  onModify() {
    this.router.navigate(['/modify-post', this.post.post_id]);
  }

  onReply() {
    this.router.navigate(['post/' + this.post.post_id + '/new-comment']);
  }

  onDelete() {
    this.loading = true;
    this.postsService.deletePost(this.post.post_id).then(
      (response: { message: string }) => {
        this.loading = false;
        this.router.navigate(['/posts']);
      }
    ).catch(
      (error) => {
        this.loading = false;
        this.errorMessage = error.message;
        console.error(error);
      }
    );
  }

  onDeleteUser(accountId: string) {
    this.auth.deleteUser(accountId).then((response: any) => {
      alert('Utilisateur supprimé avec succès !');
      this.router.navigate(['/posts']);
    });
  }

  updateCommentList(commentId: string) {
    let position;
    this.comments.forEach(function (comment, i) {
      if (comment.comment_id === commentId) {
        position = i;
      }
    });
    this.comments.splice(position, 1);
  }

  onLike() {
    if (this.disliked) {
      return 0;
    }
    this.likePending = true;
    const like = this.liked ? 0 : 1;
    this.postsService.likePost(this.userId, this.post.post_id, like).then(
      (result: any) => {
        console.log(result);
        this.likePending = false;
        this.liked = !this.liked;
        if (this.liked) {
          this.post.likes++;
        } else {
          this.post.likes--;
        }
      }
    );
  }

  onDislike() {
    if (this.liked) {
      return 0;
    }
    this.likePending = true;
    const dislike = this.disliked ? 0 : -1;
    this.postsService.likePost(this.userId, this.post.post_id, dislike).then(
      (result: any) => {
        this.likePending = false;
        this.disliked = !this.disliked;
        if (this.disliked) {
          this.post.dislikes++;
        } else {
          this.post.dislikes--;
        }
      }
    );
  }


}
