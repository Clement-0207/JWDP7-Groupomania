import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading: boolean;
  errorMsg: string;

  constructor(private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      name: [null, [Validators.required, , Validators.pattern('[a-zA-Z ]*')]],
      password: [null, Validators.required]
    });
  }

  onLogin() {
    this.loading = true;
    const name = this.loginForm.get('name').value;
    const password = this.loginForm.get('password').value;
    this.auth.loginUser(name, password).then(
      () => {
        this.loading = false;
        this.router.navigate(['/posts']);
      }
    ).catch(
      (error) => {
        this.loading = false;
        this.errorMsg = error.message;
      }
    );
  }

}
