import { AfterViewInit, Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule, FormInputModule } from 'zigzag';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

declare var VANTA: any;

@Component({
  selector: 'app-login',
  template: ` <section class="flex flex-col md:flex-row h-screen items-center">
    <div class="bg-indigo-600 hidden relative lg:block w-full md:w-1/2 xl:w-2/3 h-screen">
      <div class="w-full h-full" id="vanta"></div>
      <div class="absolute z-20 bottom-4 w-full left-0 text-center">
        <a href="https://github.com/adisreyaj" target="_blank" class="text-white font-medium text-md">
          <style>
            .heart {
              color: #e25555;
            }
          </style>
          I <span class="heart">♥</span> Opensource
        </a>
      </div>
      <div class="h-full w-full grid place-items-center absolute z-10 top-0 left-0 bg-black bg-opacity-50">
        <div>
          <div class="flex gap-4 font-bold text-8xl font-heading items-center text-white">
            <p class="uppercase">Curate</p>
            <p class="text-4xl font-normal -my-1">&</p>
            <p class="uppercase">Share</p>
          </div>
          <div class="text-white mt-10 max-w-md mx-auto">
            <p class="text-md font-medium">
              Worked on a side project? Showcase all the cool Open Source libraries that powered your project and let
              the world know about them.<br />
              <br />Libshare brings more visibility to OSS projects and makes it easy for people to explore about great
              libraries.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div
      class="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto  md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12
        flex items-center justify-center"
    >
      <div class="w-full h-100 max-w-md">
        <div class="flex items-stretch gap-4">
          <img src="assets/images/logo.svg" alt="Lib Share" class="w-20 h-20" />
        </div>
        <h1 class="text-xl md:text-2xl font-bold leading-tight mt-8">Log in to LibShare</h1>
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
          <a routerLink="/signup" class="text-primary hover:text-blue-700 font-semibold">Create an account</a>
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
export class LoginPage implements AfterViewInit {
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

  ngAfterViewInit() {
    VANTA.HALO({
      el: '#vanta',
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      baseColor: '#3b3d6d',
      backgroundColor: '#3b3d6d',
      amplitudeFactor: 0.9,
      xOffset: 0,
      yOffset: 0.2,
      size: 1.0,
    });
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
