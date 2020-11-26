import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Comment } from '../models/Comment.model';
import { CommentsService } from '../services/comments.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-single-comment',
  templateUrl: './single-comment.component.html',
  styleUrls: ['./single-comment.component.scss']
})
export class SingleCommentComponent implements OnInit {

  @Output() commentDeletedEvent = new EventEmitter<string>();

  @Input() comment_id: string;
  @Input() post_id: string;
  @Input() comment_body: string;
  @Input() written_on: string;
  @Input() nbLikes: number;
  @Input() nbDislikes: number;
  @Input() name: string;
  @Input() account_id: string;

  loading: boolean;
  errorMessage: string;
  userId: string;
  liked: boolean;
  disliked: boolean;
  likePending: boolean;
  isAdmin: boolean;

  constructor(private commentsService: CommentsService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router,
    public datepipe: DatePipe) { }

  ngOnInit() {
    this.isAdmin = this.auth.getIsAdmin();
    this.likePending = false;
    this.userId = this.auth.getUserId();
    this.loading = true;
    this.route.params.subscribe(
      (params) => {
        this.commentsService.getCommentLikeById(this.comment_id, this.post_id, this.userId).then(
          (result: any) => {
            this.loading = false;
            if (result.result === 1 && result.like === 1) {
              this.liked = true;
            } else if (result.result === 1 && result.like === 0) {
              this.disliked = true;
            }
          }
        );
      }
    );
    this.userId = this.auth.getUserId();
  }

  onModify() {
    this.router.navigate(['post/' + this.post_id + '/modify-comment', this.comment_id]);
  }

  onDelete() {
    this.loading = true;
    this.commentsService.deleteComment(this.comment_id, this.post_id).then(
      (response: { message: string }) => {
        this.loading = false;
        this.commentDeletedEvent.emit(this.comment_id);
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

  onLike() {
    if (this.disliked) {
      return 0;
    }
    this.likePending = true;
    const like = this.liked ? 0 : 1;
    this.commentsService.likeComment(this.userId, this.comment_id, this.post_id, like).then(
      (result: any) => {
        this.likePending = false;
        this.liked = !this.liked;
        if (this.liked) {
          this.nbLikes++;
        } else {
          this.nbLikes--;
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
    this.commentsService.likeComment(this.userId, this.comment_id, this.post_id, dislike).then(
      (result: any) => {
        this.likePending = false;
        this.disliked = !this.disliked;
        if (this.disliked) {
          this.nbDislikes++;
        } else {
          this.nbDislikes--;
        }
      }
    );
  }

}
