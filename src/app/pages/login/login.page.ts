import { AfterViewInit, Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule, FormInputModule } from 'zigzag';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { LoaderService } from '../../services/loader.service';

declare var VANTA: any;

@Component({
  selector: 'app-login',
  template: ` <section class="flex h-screen flex-col items-center md:flex-row">
    <div class="relative hidden h-screen w-full bg-indigo-600 md:w-1/2 lg:block xl:w-2/3">
      <div class="h-full w-full" id="vanta"></div>
      <div class="absolute bottom-4 left-0 z-20 w-full text-center">
        <a href="https://github.com/adisreyaj" target="_blank" class="text-md font-medium text-white">
          <style>
            .heart {
              color: #e25555;
            }
          </style>
          For the <span class="heart">♥</span> of Opensource
        </a>
      </div>
      <div class="absolute top-0 left-0 z-10 grid h-full w-full place-items-center bg-black bg-opacity-50">
        <div>
          <div class="flex items-center gap-4 font-heading text-8xl font-bold text-white">
            <p class="">Curate</p>
            <p class="-my-1 text-4xl font-normal">&</p>
            <p class="">Share</p>
          </div>
          <div class="mx-auto mt-10 max-w-md text-white">
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
      class="flex h-screen w-full items-center justify-center  bg-white px-6 md:mx-auto md:w-1/2 md:max-w-md lg:max-w-full
        lg:px-16 xl:w-1/3 xl:px-12"
    >
      <div class="h-100 w-full max-w-md">
        <div class="flex items-center gap-4">
          <img src="assets/images/logo.svg" alt="Lib Share" class="h-16 w-16" />
          <div>
            <p class="-mb-2 font-heading text-4xl font-semibold">LibShare</p>
            <p class="font-heading text-lg text-slate-400">Curate <span>&</span> Share</p>
          </div>
        </div>
        <h1 class="mt-8 text-xl font-bold leading-tight md:text-2xl">Log in to your account.</h1>
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
          <button type="submit" class="mt-10 w-full" zzButton variant="primary" [disabled]="loader.showLoader$ | async">
            Log In
          </button>
        </form>

        <p class="mt-8">
          Need an account?
          <a routerLink="/signup" class="font-semibold text-primary hover:text-blue-700">Create an account</a>
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

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    public readonly loader: LoaderService,
  ) {
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
      backgroundColor: '#2B2C30',
      amplitudeFactor: 0.9,
      xOffset: 0,
      yOffset: 0.2,
      size: 1.0,
    });
  }

  login() {
    this.loader.show();
    this.auth.login(this.credentials.email, this.credentials.password).subscribe({
      next: ({ token }) => {
        localStorage.setItem('token', token);
        this.router.navigate(['/']);
        this.loader.hide();
      },
      error: (err) => {
        console.log(err);
        this.loader.hide();
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
