import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  loading: boolean;
  errorMsg: string;

  constructor(private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      password: [null, Validators.required]
    });
  }

  onSignup() {
    this.loading = true;
    const name = this.signupForm.get('name').value;
    const password = this.signupForm.get('password').value;
    this.auth.createUser(name, password).then(
      (response: { message: string }) => {
        this.auth.loginUser(name, password).then(
          () => {
            this.loading = false;
            this.router.navigate(['/posts']);
          }
        ).catch(
          (error) => {
            this.loading = false;
            console.error(error);
            this.errorMsg = error.message;
          }
        );
      }
    ).catch((error) => {
      this.loading = false;
      console.error(error);
      this.errorMsg = error.message;
    });
  }

}
