import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentsService } from '../services/comments.service';
import { Comment } from '../models/Comment.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss']
}

) export class CommentFormComponent implements OnInit {

  commentForm: FormGroup;
  mode: string;
  loading: boolean;
  comment: Comment;
  errorMsg: string;
  postId: string;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private commentsService: CommentsService,
    private auth: AuthService) { }

  ngOnInit() {
    this.loading = true;

    this.route.params.subscribe((params) => {
      this.postId = params.postId;
      if (!params.id) {
        this.mode = 'new';
        this.initEmptyForm();
        this.loading = false;
      } else {
        this.mode = 'edit';
        this.commentsService.getCommentById(params.id, this.postId).then((comment: Comment) => {
          this.comment = comment;
          this.initModifyForm(comment);
          this.loading = false;
        }).catch((error) => {
          this.errorMsg = JSON.stringify(error);
        });
      }
    });
  }

  initEmptyForm() {
    this.commentForm = this.formBuilder.group({
      comment_body: [null, Validators.required]
    }
    );
  }

  initModifyForm(comment: Comment) {
    this.commentForm = this.formBuilder.group({
      comment_body: [this.comment.comment_body, Validators.required]
    }
    );
  }

  onSubmit() {
    this.loading = true;
    const newComment = new Comment();
    newComment.comment_body = this.commentForm.get('comment_body').value;
    newComment.post_message_id = this.postId;
    newComment.account_id = this.auth.getUserId();
    if (this.mode === 'new') {
      this.commentsService.createComment(newComment).then((response: {
        message: string
      }

      ) => {
        this.loading = false;
        this.router.navigate(['/post/' + this.postId]);
      }

      ).catch((error) => {
        console.error(error);
        this.loading = false;
        this.errorMsg = error.message;
      }

      );
    }

    else if (this.mode === 'edit') {
      newComment.comment_id = this.comment.comment_id;
      this.commentsService.modifyComment(newComment).then((response: {
        message: string
      }

      ) => {
        this.loading = false;
        this.router.navigate(['/post/' + this.postId]);
      }

      ).catch((error) => {
        console.error(error);
        this.loading = false;
        this.errorMsg = error.message;
      }

      );
    }
  }
}