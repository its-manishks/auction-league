import {
  Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output, ViewChild
} from '@angular/core';

import { Player } from '../models/player.model';
import { Team } from '../models/team.model';
import { categoryClass, initial, PLAYER_CATEGORIES, setBodyScrollLock } from '../shared/ui-helpers';

/**
 * Presentational player pool: filters, table and the create/edit modal.
 * AdminComponent performs the API calls and calls closeForm()/showFormError().
 */
@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnDestroy {

  @Input() players: Player[] = [];
  /** Used to validate price edits of sold players against their team's budget. */
  @Input() teams: Team[] = [];
  @Input() spentByTeam: { [teamId: number]: number } = {};
  @Input() loading = false;
  @Input() loadError = '';
  @Input() saving = false;
  @Input() highlightId: any = null;

  @Output() editPlayerEvent = new EventEmitter<Player>();
  @Output() saveEditedPlayerEvent = new EventEmitter<Player>();
  @Output() cancelEditPlayerEvent = new EventEmitter<void>();
  @Output() deletePlayerEvent = new EventEmitter<any>();
  @Output() createPlayerEvent = new EventEmitter<Player>();
  @Output() retry = new EventEmitter<void>();

  @ViewChild('firstField') firstField?: ElementRef<HTMLInputElement>;

  readonly categories = PLAYER_CATEGORIES;
  readonly categoryClass = categoryClass;
  readonly initial = initial;

  newPlayer: Player = this.blankPlayer();
  editedPlayer: Player | null = null;
  /** Price before editing, needed for the budget check on sold players. */
  private originalPrice = 0;

  formOpen = false;
  submitted = false;
  formError = '';

  query = '';
  categoryFilter = 'All';
  statusFilter: 'all' | 'sold' | 'unsold' = 'all';

  ngOnDestroy(): void {
    setBodyScrollLock(false);
  }

  /* ---------- Derived data ---------- */

  get filteredPlayers(): Player[] {
    const q = this.query.trim().toLowerCase();
    return (this.players || []).filter((p) =>
      (!q || (p.name || '').toLowerCase().includes(q)) &&
      (this.categoryFilter === 'All' || p.category === this.categoryFilter) &&
      (this.statusFilter === 'all' || (this.statusFilter === 'sold') === !!p.sold)
    );
  }

  get hasFilters(): boolean {
    return !!this.query.trim() || this.categoryFilter !== 'All' || this.statusFilter !== 'all';
  }

  /** Categories present in data plus the standard ones (keeps legacy values filterable). */
  get filterCategories(): string[] {
    const set = new Set<string>(this.categories);
    (this.players || []).forEach((p) => p.category && set.add(p.category));
    return Array.from(set);
  }

  get isEdit(): boolean {
    return !!this.editedPlayer;
  }

  get model(): Player {
    return this.editedPlayer || this.newPlayer;
  }

  /** Team that currently owns the player being edited (if sold). */
  get ownerTeam(): Team | null {
    const p = this.editedPlayer;
    if (!p || !p.sold || !p.team || p.team.id == null) {
      return null;
    }
    return (this.teams || []).find((t) => t.id === p.team!.id) || p.team;
  }

  clearFilters(): void {
    this.query = '';
    this.categoryFilter = 'All';
    this.statusFilter = 'all';
  }

  /* ---------- Validation (mirrors the backend bean validation) ---------- */

  get nameError(): string {
    return (this.model.name || '').trim() ? '' : 'Name is required';
  }

  get ageError(): string {
    const age = this.model.age as any;
    if (age === null || age === undefined || age === '') {
      return 'Age is required';
    }
    if (!Number.isInteger(Number(age))) {
      return 'Age must be a whole number';
    }
    if (Number(age) < 15 || Number(age) > 50) {
      return 'Age must be between 15 and 50';
    }
    return '';
  }

  get categoryError(): string {
    return this.model.category ? '' : 'Category is required';
  }

  get priceError(): string {
    const price = this.model.biddingPrice as any;
    if (price === null || price === undefined || price === '') {
      return 'Bidding price is required';
    }
    if (!(Number(price) > 0)) {
      return 'Bidding price must be greater than zero';
    }
    const team = this.ownerTeam;
    if (team && team.id != null) {
      const spentWithout = (this.spentByTeam[team.id] || 0) - this.originalPrice;
      const available = (Number(team.maximumBudget) || 0) - spentWithout;
      if (Number(price) > available) {
        return `${team.name} can only afford up to ${available.toLocaleString('en-US')} for this player.`;
      }
    }
    return '';
  }

  biddingPriceStatus(): string {
    if (!this.model.biddingPrice || this.model.biddingPrice <= 0) {
      return 'Enter a base price greater than zero.';
    }
    return `Base price set to ${Number(this.model.biddingPrice).toLocaleString('en-US')}.`;
  }

  /* ---------- Actions ---------- */

  openCreate(): void {
    this.editedPlayer = null;
    this.newPlayer = this.blankPlayer();
    this.openForm();
  }

  onEditPlayer(player: Player): void {
    this.editedPlayer = { ...player };
    this.originalPrice = Number(player.biddingPrice) || 0;
    this.editPlayerEvent.emit(player);
    this.openForm();
  }

  onSaveEditedPlayer(): void {
    if (this.editedPlayer) {
      this.saveEditedPlayerEvent.emit(this.normalise(this.editedPlayer));
    }
  }

  onCancelEditPlayer(): void {
    if (this.saving) {
      return;
    }
    this.closeForm();
    this.cancelEditPlayerEvent.emit();
  }

  onDeletePlayer(playerId: any): void {
    this.deletePlayerEvent.emit(playerId);
  }

  createPlayer(): void {
    this.createPlayerEvent.emit(this.normalise(this.newPlayer));
  }

  submit(): void {
    this.submitted = true;
    this.formError = '';
    if (this.nameError || this.ageError || this.categoryError || this.priceError || this.saving) {
      return;
    }
    if (this.isEdit) {
      this.onSaveEditedPlayer();
    } else {
      this.createPlayer();
    }
  }

  closeForm(): void {
    this.formOpen = false;
    this.editedPlayer = null;
    this.newPlayer = this.blankPlayer();
    this.submitted = false;
    this.formError = '';
    setBodyScrollLock(false);
  }

  showFormError(message: string): void {
    this.formError = message;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.formOpen) {
      this.onCancelEditPlayer();
    }
  }

  onBackdrop(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.onCancelEditPlayer();
    }
  }

  trackById(_: number, player: Player): any {
    return player.id;
  }

  private normalise(p: Player): Player {
    // Drop UI-only fields; keep id/sold/team so an edit does not change sale status.
    const { selectedTeamId, ...rest } = p;
    return {
      ...rest,
      name: (p.name || '').trim(),
      age: Number(p.age),
      biddingPrice: Number(p.biddingPrice)
    };
  }

  private blankPlayer(): Player {
    return { name: '', age: undefined, category: 'Batsman', biddingPrice: undefined };
  }

  private openForm(): void {
    this.submitted = false;
    this.formError = '';
    this.formOpen = true;
    setBodyScrollLock(true);
    setTimeout(() => this.firstField && this.firstField.nativeElement.focus());
  }
}
