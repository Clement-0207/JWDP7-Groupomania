import { Component, OnInit } from '@angular/core';
import { PostsService } from '../services/posts.service';
import { Subscription } from 'rxjs';
import { Post } from '../models/Post.model';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  userName: string;
  errorMessage: string;

  constructor(private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
    this.userName = this.authService.getName();
  }

  onDeleteUser() {
    this.authService.deleteUser(this.authService.getUserId()).then(result  => {
      console.log(result);
      if (result['message']) {
        alert(result['message'] + ' Vous allez être redirigé vers la page d\'accueil');
        this.authService.logout();
      } else {
        this.errorMessage = 'Oups, une erreur est survenue lors de la suppression de votre compte.';
      }
    }).catch(error => {
      this.errorMessage = 'Oups, une erreur est survenue lors de la suppression de votre compte.';
    })
  }

  onModifyUser() {
    this.router.navigate(['modify-user']);
  }

}
