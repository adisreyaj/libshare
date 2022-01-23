import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { ButtonModule } from 'zigzag';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-header',
  template: ` <header class="flex items-center gap-4">
    <h2 class="text-xl font-semibold">{{ title }}</h2>
    <button *ngIf="buttonText" zzButton size="sm" (click)="clicked.emit()">{{ buttonText }}</button>
  </header>`,
})
export class PageHeaderComponent {
  @Input() title!: string;
  @Input() buttonText?: string;

  @Output()
  clicked = new EventEmitter<void>();
}

@NgModule({
  declarations: [PageHeaderComponent],
  exports: [PageHeaderComponent],
  imports: [CommonModule, ButtonModule],
})
export class PageHeaderModule {}
