import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonModule } from 'zigzag';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { API_URL } from './core/tokens/api.token';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ShellModule } from './shell.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { USER_DATA } from './core/tokens/user.token';
import { AuthService } from './services/auth.service';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ShellModule,
    ButtonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: API_URL,
      useValue: environment.apiUrl,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: USER_DATA,
      useFactory: (auth: AuthService) => {
        return auth.user$;
      },
      deps: [AuthService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
