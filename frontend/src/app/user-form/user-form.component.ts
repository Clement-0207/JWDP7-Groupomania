import { Component, OnInit } from '@angular/core';
import { PostsService } from '../services/posts.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Post } from '../models/Post.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  name: string;
  userForm: FormGroup;
  errorMsg: string;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private posts: PostsService,
    private auth: AuthService) { }

  ngOnInit() {
    this.name = this.auth.getName();
    this.initForm();
  }

  initForm() {
    this.userForm = this.formBuilder.group({
      userName: [this.name, Validators.required],
      oldPassword: [null, Validators.required],
      newPassword: [null, Validators.required],
      newPasswordConfirmation: [null, Validators.required],
    }
    );
  }

  onSubmit() {
    let user: any;
    user = {};
    console.log(this.userForm);
    user.name = this.userForm.get('userName').value;
    user.oldPassword = this.userForm.get('oldPassword').value;

    if (this.userForm.get('newPassword').value !== this.userForm.get('newPasswordConfirmation').value) {
      this.errorMsg = 'La confirmation du mot de passe ne correspond pas au nouveau mot de passe.';
    } else {
      user.newPassword = this.userForm.get('newPassword').value;
      const accountId = this.auth.getUserId();
      this.auth.modifyUser(user, accountId).then((response: {
        message: string
      }) => {
        console.log(response.message);
        this.router.navigate(['/user']);
      }

      ).catch((error) => {
        console.error(error);
        this.errorMsg = error.message;
      }

      );
    }
  }

}
