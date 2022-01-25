import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  template: ` <router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject<void>();

  constructor(private readonly auth: AuthService) {}

  ngOnInit() {
    this.auth.getLoggedInUserDetails().subscribe();
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }
}
