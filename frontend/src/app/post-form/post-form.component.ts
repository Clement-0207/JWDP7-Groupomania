import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService } from '../services/posts.service';
import { Post } from '../models/Post.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
}

) export class PostFormComponent implements OnInit {

  postForm: FormGroup;
  mode: string;
  loading: boolean;
  post: Post;
  errorMsg: string;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private posts: PostsService,
    private auth: AuthService) { }

  ngOnInit() {
    this.loading = true;

    this.route.params.subscribe((params) => {
      if (!params.id) {
        this.mode = 'new';
        this.initEmptyForm();
        this.loading = false;
      }

      else {
        this.mode = 'edit';

        this.posts.getPostById(params.id).then((post: Post) => {
          this.post = post;
          this.initModifyForm(post);
          this.loading = false;
        }

        ).catch((error) => {
          this.errorMsg = JSON.stringify(error);
        }

        );
      }
    }

    );
  }

  initEmptyForm() {
    this.postForm = this.formBuilder.group({
      title: [null, Validators.required],
      body: [null, Validators.required]
    }

    );
  }

  initModifyForm(post: Post) {
    this.postForm = this.formBuilder.group({
      title: [this.post.title, Validators.required],
      body: [this.post.body, Validators.required],
    }
    );
  }

  onSubmit() {
    this.loading = true;
    const newPost = new Post();
    newPost.title = this.postForm.get('title').value;
    newPost.body = this.postForm.get('body').value;

    newPost.account_id = this.auth.getUserId();
    if (this.mode === 'new') {
      this.posts.createPost(newPost).then((response: {
        message: string
      }

      ) => {
        console.log(response.message);
        this.loading = false;
        this.router.navigate(['/posts']);
      }

      ).catch((error) => {
        console.error(error);
        this.loading = false;
        this.errorMsg = error.message;
      }

      );
    }

    else if (this.mode === 'edit') {
      this.posts.modifyPost(this.post.post_id, newPost).then((response: {
        message: string
      }

      ) => {
        console.log(response.message);
        this.loading = false;
        this.router.navigate(['/posts']);
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