import {
  Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output, ViewChild
} from '@angular/core';

import { Team } from '../models/team.model';
import { initial, purseInfo, PurseInfo, setBodyScrollLock } from '../shared/ui-helpers';

/**
 * Presentational team roster: table, search, and the create/edit modal.
 * All API calls stay in AdminComponent; it calls closeForm()/showFormError()
 * once the server responds, so a failed save never loses what was typed.
 */
@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnDestroy {

  @Input() teams: Team[] = [];
  /** Sum of sold players' prices per team id. */
  @Input() spentByTeam: { [teamId: number]: number } = {};
  /** Number of sold players per team id. */
  @Input() squadSize: { [teamId: number]: number } = {};
  @Input() loading = false;
  @Input() loadError = '';
  @Input() saving = false;
  @Input() highlightId: number | null = null;

  @Output() editTeamEvent = new EventEmitter<Team>();
  @Output() saveEditedTeamEvent = new EventEmitter<Team>();
  @Output() cancelEditTeamEvent = new EventEmitter<void>();
  @Output() deleteTeamEvent = new EventEmitter<number>();
  @Output() createTeamEvent = new EventEmitter<Team>();
  @Output() retry = new EventEmitter<void>();

  @ViewChild('firstField') firstField?: ElementRef<HTMLInputElement>;

  newTeam: Team = { name: '', maximumBudget: undefined };
  editedTeam: Team | null = null;

  formOpen = false;
  submitted = false;
  formError = '';
  query = '';

  readonly initial = initial;

  ngOnDestroy(): void {
    setBodyScrollLock(false);
  }

  /* ---------- Derived data ---------- */

  get filteredTeams(): Team[] {
    const q = this.query.trim().toLowerCase();
    const list = this.teams || [];
    return q ? list.filter((t) => (t.name || '').toLowerCase().includes(q)) : list;
  }

  get isEdit(): boolean {
    return !!this.editedTeam;
  }

  /** The object the modal is bound to. */
  get model(): Team {
    return this.editedTeam || this.newTeam;
  }

  purse(team: Team): PurseInfo {
    return purseInfo(this.spentFor(team), team.maximumBudget);
  }

  spentFor(team: Team | null): number {
    return team && team.id != null ? (this.spentByTeam[team.id] || 0) : 0;
  }

  /* ---------- Validation ---------- */

  get nameError(): string {
    const name = (this.model.name || '').trim();
    if (!name) {
      return 'Team name is required';
    }
    const clash = (this.teams || []).some((t) =>
      t.id !== this.model.id && (t.name || '').trim().toLowerCase() === name.toLowerCase());
    return clash ? 'A team with this name already exists' : '';
  }

  get budgetError(): string {
    const budget = this.model.maximumBudget;
    if (budget === null || budget === undefined || (budget as any) === '') {
      return 'Maximum budget is required';
    }
    if (!(Number(budget) > 0)) {
      return 'Maximum budget must be greater than zero';
    }
    const spent = this.spentFor(this.editedTeam);
    if (this.isEdit && Number(budget) < spent) {
      return `This team has already spent ${spent.toLocaleString('en-US')}. The budget cannot be lower than that.`;
    }
    return '';
  }

  maxBidStatus(): string {
    if (this.isEdit && this.spentFor(this.editedTeam) > 0) {
      return `Already spent: ${this.spentFor(this.editedTeam).toLocaleString('en-US')}.`;
    }
    if (!this.model.maximumBudget || this.model.maximumBudget <= 0) {
      return 'Enter a maximum budget greater than zero.';
    }
    return `Maximum budget set to ${Number(this.model.maximumBudget).toLocaleString('en-US')}.`;
  }

  /* ---------- Actions ---------- */

  openCreate(): void {
    this.editedTeam = null;
    this.newTeam = { name: '', maximumBudget: undefined };
    this.openForm();
  }

  onEditTeam(team: Team): void {
    this.editedTeam = { ...team };
    this.editTeamEvent.emit(team);
    this.openForm();
  }

  onSaveEditedTeam(): void {
    if (this.editedTeam) {
      this.saveEditedTeamEvent.emit({
        ...this.editedTeam,
        name: (this.editedTeam.name || '').trim(),
        maximumBudget: Number(this.editedTeam.maximumBudget)
      });
    }
  }

  onCancelEditTeam(): void {
    if (this.saving) {
      return;
    }
    this.closeForm();
    this.cancelEditTeamEvent.emit();
  }

  onDeleteTeam(teamId: number): void {
    this.deleteTeamEvent.emit(teamId);
  }

  createTeam(): void {
    this.createTeamEvent.emit({
      name: (this.newTeam.name || '').trim(),
      maximumBudget: Number(this.newTeam.maximumBudget)
    });
  }

  submit(): void {
    this.submitted = true;
    this.formError = '';
    if (this.nameError || this.budgetError || this.saving) {
      return;
    }
    if (this.isEdit) {
      this.onSaveEditedTeam();
    } else {
      this.createTeam();
    }
  }

  /** Called by the parent after a successful save. */
  closeForm(): void {
    this.formOpen = false;
    this.editedTeam = null;
    this.newTeam = { name: '', maximumBudget: undefined };
    this.submitted = false;
    this.formError = '';
    setBodyScrollLock(false);
  }

  /** Called by the parent when the server rejects a save. */
  showFormError(message: string): void {
    this.formError = message;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.formOpen) {
      this.onCancelEditTeam();
    }
  }

  onBackdrop(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.onCancelEditTeam();
    }
  }

  trackById(_: number, team: Team): any {
    return team.id;
  }

  private openForm(): void {
    this.submitted = false;
    this.formError = '';
    this.formOpen = true;
    setBodyScrollLock(true);
    setTimeout(() => this.firstField && this.firstField.nativeElement.focus());
  }
}
