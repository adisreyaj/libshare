import { Component } from '@angular/core';
import { LoaderService } from './services/loader.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
    <div
      @fadeSlideInOut
      *ngIf="this.loaderService.showLoader$ | async"
      class="fixed bottom-4 right-4 flex items-center gap-4 rounded-md bg-primary p-4 shadow-2xl"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-8 w-8"
        style="margin:auto;background:0 0;display:block;shape-rendering:auto"
        width="200"
        height="200"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
      >
        <circle
          cx="50"
          cy="50"
          fill="none"
          stroke="#fff"
          stroke-width="10"
          r="42"
          stroke-dasharray="197.92033717615698 67.97344572538566"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            repeatCount="indefinite"
            dur="0.5319148936170213s"
            values="0 50 50;360 50 50"
            keyTimes="0;1"
          />
        </circle>
      </svg>
      <p class="text-sm text-white">Loading...Hold Tight!</p>
    </div>
  `,
  animations: [
    trigger('fadeSlideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('200ms', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [animate('200ms', style({ opacity: 0, transform: 'translateY(10px)' }))]),
    ]),
  ],
})
export class AppComponent {
  constructor(public loaderService: LoaderService) {}
}
