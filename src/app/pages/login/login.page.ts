import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule, FormInputModule } from 'zigzag';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  template: ` <section class="flex flex-col md:flex-row h-screen items-center">
    <div class="bg-indigo-600 hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen">
      <img src="https://source.unsplash.com/random" alt="" class="w-full h-full object-cover" />
    </div>
    <div
      class="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto  md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12
        flex items-center justify-center"
    >
      <div class="w-full h-100">
        <h1 class="text-xl md:text-2xl font-bold leading-tight mt-12">Log in to your account</h1>
        <form class="mt-6" (ngSubmit)="login()">
          <div>
            <label class="block text-sm text-gray-700" for="email">Email Address</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter Email Address"
              zzInput
              variant="fill"
              class="w-full"
              autofocus
              autocomplete
              required
              [(ngModel)]="credentials.email"
            />
          </div>

          <div class="mt-4">
            <label class="block text-sm text-gray-700" for="email">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter Password"
              minlength="6"
              zzInput
              variant="fill"
              class="w-full"
              required
              [(ngModel)]="credentials.password"
            />
          </div>
          <button type="submit" class="w-full mt-10" zzButton variant="primary">Log In</button>
        </form>

        <p class="mt-8">
          Need an account?
          <a routerLink="/signup" class="text-primary hover:text-blue-700 font-semibold"
            >Create an account</a
          >
        </p>
      </div>
    </div>
  </section>`,
  styles: [
    `
      input {
        @apply mt-1;
      }
    `,
  ],
})
export class LoginPage {
  credentials = {
    email: '',
    password: '',
  };

  constructor(private readonly auth: AuthService, private readonly router: Router) {
    const token = localStorage.getItem('token');
    if (token != null) {
      this.router.navigate(['/']);
    }
  }

  login() {
    this.auth.login(this.credentials.email, this.credentials.password).subscribe({
      next: ({ token }) => {
        localStorage.setItem('token', token);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}

@NgModule({
  declarations: [LoginPage],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: LoginPage,
      },
    ]),
    ButtonModule,
    FormsModule,
    FormInputModule,
  ],
})
export class LoginModule {}
