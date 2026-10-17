import { AfterViewChecked, Component, ElementRef, HostListener, ViewChild } from '@angular/core';

import { ConfirmService } from '../services/confirm.service';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <ng-container *ngIf="confirmService.request$ | async as req">
      <div class="modal-backdrop fade show"></div>
      <div class="modal fade show d-block" tabindex="-1" role="alertdialog" aria-modal="true"
           aria-labelledby="confirm-title" aria-describedby="confirm-message"
           (click)="onBackdrop($event)">
        <div class="modal-dialog modal-dialog-centered modal-sm-wide">
          <div class="modal-content">
            <div class="modal-body p-4">
              <div class="confirm-icon" [class.confirm-icon-danger]="req.danger" aria-hidden="true">
                <i class="bi" [ngClass]="req.danger ? 'bi-exclamation-triangle' : 'bi-question-circle'"></i>
              </div>
              <h2 id="confirm-title" class="h5 mb-2">{{ req.title }}</h2>
              <p id="confirm-message" class="text-secondary mb-0">{{ req.message }}</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-light" (click)="confirmService.close(false)">Cancel</button>
              <button #confirmBtn type="button" class="btn"
                      [ngClass]="req.danger ? 'btn-danger' : 'btn-primary'"
                      (click)="confirmService.close(true)">
                {{ req.confirmText || 'Confirm' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ng-container>
  `
})
export class ConfirmDialogComponent implements AfterViewChecked {

  @ViewChild('confirmBtn') confirmBtn?: ElementRef<HTMLButtonElement>;
  private focused = false;

  constructor(public confirmService: ConfirmService) { }

  ngAfterViewChecked(): void {
    // Move focus into the dialog once, when it opens.
    if (this.confirmBtn && !this.focused) {
      this.focused = true;
      this.confirmBtn.nativeElement.focus();
    } else if (!this.confirmBtn) {
      this.focused = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.confirmService.close(false);
  }

  onBackdrop(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.confirmService.close(false);
    }
  }
}
