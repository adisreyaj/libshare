import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule, FormInputModule } from 'zigzag';

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
        <form class="mt-6">
          <div>
            <label class="block text-sm text-gray-700">Email Address</label>
            <input
              type="email"
              name=""
              id=""
              placeholder="Enter Email Address"
              zzInput
              variant="fill"
              class="w-full"
              autofocus
              autocomplete
              required
            />
          </div>

          <div class="mt-4">
            <label class="block text-sm text-gray-700">Password</label>
            <input
              type="password"
              name=""
              id=""
              placeholder="Enter Password"
              minlength="6"
              zzInput
              variant="fill"
              class="w-full"
              required
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
export class LoginPage {}

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
    FormInputModule,
  ],
})
export class LoginModule {}
