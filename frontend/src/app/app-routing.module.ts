import {
  NgModule
}

  from '@angular/core';

import {
  Routes,
  RouterModule
}

  from '@angular/router';

import {
  PostListComponent
}

  from './post-list/post-list.component';

import {
  PostFormComponent
}

  from './post-form/post-form.component';

import {
  CommentFormComponent
}

  from './comment-form/comment-form.component';

import {
  SinglePostComponent
}

  from './single-post/single-post.component';

import {
  SignupComponent
}

  from './auth/signup/signup.component';

import {
  LoginComponent
}

  from './auth/login/login.component';

import {
  UserComponent
}

  from './user/user.component';

import {
  UserFormComponent
}

  from './user-form/user-form.component';

import {
  AuthGuard
}

  from './services/auth-guard.service';

const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'modify-user', component: UserFormComponent, canActivate: [AuthGuard] },
  { path: 'posts', component: PostListComponent, canActivate: [AuthGuard] },
  { path: 'post/:id', component: SinglePostComponent, canActivate: [AuthGuard] },
  { path: 'new-post', component: PostFormComponent, canActivate: [AuthGuard] },
  { path: 'modify-post/:id', component: PostFormComponent, canActivate: [AuthGuard] },
  { path: 'post/:postId/modify-comment/:id', component: CommentFormComponent, canActivate: [AuthGuard] },
  { path: 'post/:postId/new-comment', component: CommentFormComponent, canActivate: [AuthGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'posts' },
  { path: '**', redirectTo: 'posts' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
}

) export class AppRoutingModule { }