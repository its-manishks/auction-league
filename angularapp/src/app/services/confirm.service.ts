import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  danger?: boolean;
}

export interface ConfirmRequest extends ConfirmOptions {
  resolve: (confirmed: boolean) => void;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {

  private readonly requestSubject = new BehaviorSubject<ConfirmRequest | null>(null);
  readonly request$ = this.requestSubject.asObservable();

  /** Opens the confirmation dialog; resolves true when the user confirms. */
  ask(options: ConfirmOptions): Promise<boolean> {
    // Resolve any dialog that is still open as "cancelled".
    this.close(false);
    return new Promise<boolean>((resolve) => {
      this.requestSubject.next({ ...options, resolve });
    });
  }

  close(confirmed: boolean): void {
    const current = this.requestSubject.value;
    if (current) {
      this.requestSubject.next(null);
      current.resolve(confirmed);
    }
  }
}
