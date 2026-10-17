import { Component } from '@angular/core';

import { Toast, ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast-container',
  template: `
    <div class="toast-stack" aria-live="polite" aria-atomic="false">
      <div *ngFor="let toast of (toastService.toasts$ | async); trackBy: trackById"
           class="app-toast" [ngClass]="'app-toast-' + toast.kind"
           [attr.role]="toast.kind === 'error' ? 'alert' : 'status'">
        <i class="bi" aria-hidden="true"
           [ngClass]="toast.kind === 'success' ? 'bi-check-circle-fill'
                    : toast.kind === 'error' ? 'bi-exclamation-octagon-fill' : 'bi-info-circle-fill'"></i>
        <span class="app-toast-msg">{{ toast.message }}</span>
        <button type="button" class="btn-close btn-close-sm" aria-label="Dismiss notification"
                (click)="toastService.dismiss(toast.id)"></button>
      </div>
    </div>
  `
})
export class ToastContainerComponent {
  constructor(public toastService: ToastService) { }

  trackById(_: number, toast: Toast): number {
    return toast.id;
  }
}
