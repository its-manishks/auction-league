import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastKind = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {

  private nextId = 1;
  private readonly toastsSubject = new BehaviorSubject<Toast[]>([]);
  readonly toasts$ = this.toastsSubject.asObservable();

  success(message: string): void { this.show('success', message); }
  error(message: string): void { this.show('error', message, 7000); }
  info(message: string): void { this.show('info', message); }

  dismiss(id: number): void {
    this.toastsSubject.next(this.toastsSubject.value.filter((t) => t.id !== id));
  }

  private show(kind: ToastKind, message: string, duration = 4000): void {
    const toast: Toast = { id: this.nextId++, kind, message };
    // Keep at most 4 visible so a burst of errors does not cover the page.
    this.toastsSubject.next([...this.toastsSubject.value, toast].slice(-4));
    setTimeout(() => this.dismiss(toast.id), duration);
  }
}
