import { Component, OnInit } from '@angular/core';

import { OrganizerService } from '../services/organizer.service';
import { ToastService } from '../services/toast.service';
import { ConfirmService } from '../services/confirm.service';
import { readApiError } from '../services/api-error';
import { Player } from '../models/player.model';
import { Team } from '../models/team.model';
import { AssignPlayer } from '../models/assign-player.model';
import { categoryClass, initial, purseInfo, PurseInfo } from '../shared/ui-helpers';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.css']
})
export class OrganizerComponent implements OnInit {

  teams: Team[] = [];
  unsoldPlayers: Player[] = [];
  soldPlayers: Player[] = [];

  // Team-wise players
  teamPlayers: { [teamId: number]: Player[] } = {};

  categories: string[] = ['All'];
  selectedCategory = 'All';
  selectedTeamId: any = null;
  query = '';

  showList: { [teamId: number]: boolean } = {};

  assign: AssignPlayer = {};

  errorMessage = '';
  successMessage = '';

  assignErrorMessages: { [playerId: number]: string } = {};
  assignSuccessMessages: { [playerId: number]: string } = {};

  loadingTeams = false;
  loadingUnsold = false;
  loadingSquad: { [teamId: number]: boolean } = {};
  assigningId: any = null;
  releasingId: any = null;

  /** Money committed and squad size per team, from the sold-players list. */
  spentByTeam: { [teamId: number]: number } = {};
  squadCount: { [teamId: number]: number } = {};

  readonly categoryClass = categoryClass;
  readonly initial = initial;

  constructor(
    private organizerService: OrganizerService,
    private toast: ToastService,
    private confirm: ConfirmService
  ) { }

  ngOnInit(): void {
    this.getTeams();
    this.getUnsoldPlayers();
    this.getSoldPlayers();
  }

  refresh(): void {
    this.errorMessage = '';
    this.getTeams();
    this.getUnsoldPlayers();
    this.getSoldPlayers();
    this.reloadOpenSquads();
  }

  /* ---------- Loading ---------- */

  getTeams(): void {
    this.loadingTeams = true;
    this.organizerService.getTeams().subscribe({
      next: (teams: Team[]) => {
        this.teams = teams || [];
        this.loadingTeams = false;
      },
      error: (error: any) => {
        this.loadingTeams = false;
        this.errorMessage = readApiError(error, 'Teams could not be loaded. Check that the server is running.');
      }
    });
  }

  getUnsoldPlayers(): void {
    this.loadingUnsold = true;
    this.organizerService.getUnsoldPlayers().subscribe({
      next: (players: Player[]) => {
        // Keep any team a user had already picked in a row that is still unsold.
        const picked: { [id: number]: any } = {};
        this.unsoldPlayers.forEach((p) => { if (p.id != null) { picked[p.id] = p.selectedTeamId; } });

        this.unsoldPlayers = (players || []).map((p) => ({
          ...p,
          selectedTeamId: p.id != null && picked[p.id] !== undefined ? picked[p.id] : null
        }));
        this.loadingUnsold = false;

        const distinct = new Set<string>();

        this.unsoldPlayers.forEach((player) => {
          if (player.category) {
            distinct.add(player.category);
          }
        });

        this.categories = ['All', ...Array.from(distinct)];

        // If the last player of the selected category was just sold, fall back to "All".
        if (this.categories.indexOf(this.selectedCategory) === -1) {
          this.selectedCategory = 'All';
        }
      },
      error: (error: any) => {
        this.loadingUnsold = false;
        this.errorMessage = readApiError(error, 'The unsold list could not be loaded.');
      }
    });
  }

  getSoldPlayers(): void {
    this.organizerService.getSoldPlayers().subscribe({
      next: (players: Player[]) => {
        this.soldPlayers = players || [];
        const spent: { [teamId: number]: number } = {};
        const count: { [teamId: number]: number } = {};
        this.soldPlayers.forEach((p) => {
          if (p.team && p.team.id != null) {
            spent[p.team.id] = (spent[p.team.id] || 0) + (Number(p.biddingPrice) || 0);
            count[p.team.id] = (count[p.team.id] || 0) + 1;
          }
        });
        this.spentByTeam = spent;
        this.squadCount = count;
      },
      error: () => {
        /* Purse figures are a convenience; the backend still enforces budgets. */
      }
    });
  }

  /* ---------- Derived data ---------- */

  get filteredPlayers(): Player[] {
    const q = this.query.trim().toLowerCase();
    return this.unsoldPlayers.filter((player) =>
      (!this.selectedCategory || this.selectedCategory === 'All' || player.category === this.selectedCategory) &&
      (!q || (player.name || '').toLowerCase().includes(q))
    );
  }

  categoryCount(category: string): number {
    return category === 'All'
      ? this.unsoldPlayers.length
      : this.unsoldPlayers.filter((p) => p.category === category).length;
  }

  purse(team: Team): PurseInfo {
    return purseInfo(team.id != null ? this.spentByTeam[team.id] : 0, team.maximumBudget);
  }

  canAfford(team: Team, player: Player): boolean {
    return this.purse(team).left >= (Number(player.biddingPrice) || 0);
  }

  get totalPurseLeft(): number {
    return this.teams.reduce((sum, t) => sum + Math.max(0, this.purse(t).left), 0);
  }

  get totalSpent(): number {
    return Object.keys(this.spentByTeam).reduce((sum, id) => sum + this.spentByTeam[+id], 0);
  }

  teamName(teamId: any): string {
    const team = this.teams.find((t) => t.id === teamId);
    return team && team.name ? team.name : 'the team';
  }

  /* ---------- Squads ---------- */

  toggleList(teamId: any): void {

    this.showList[teamId] = !this.showList[teamId];

    if (this.showList[teamId]) {
      this.getPlayerListInTeam(teamId);
    }
  }

  getPlayerListInTeam(teamId: any): void {

    this.loadingSquad[teamId] = true;
    this.organizerService.getPlayerListInTeam(teamId).subscribe({
      next: (players: Player[]) => {
        this.teamPlayers[teamId] = players || [];
        this.loadingSquad[teamId] = false;
      },
      error: (error: any) => {
        this.loadingSquad[teamId] = false;
        this.toast.error(readApiError(error, 'Squad could not be loaded.'));
      }
    });
  }

  /* ---------- Sell / release ---------- */

  assignPlayerToTeam(playerId: any, teamId: any): void {

    this.assignErrorMessages[playerId] = '';
    this.assignSuccessMessages[playerId] = '';

    if (!teamId) {
      this.assignErrorMessages[playerId] =
        'Pick a team before assigning the player.';
      return;
    }

    if (this.assigningId !== null) {
      return; // one sale at a time; prevents double submits
    }

    const player = this.unsoldPlayers.find((p) => p.id === playerId);
    const name = player && player.name ? player.name : 'Player';

    this.assign = {
      playerId: playerId,
      teamId: teamId
    };

    this.assigningId = playerId;

    this.organizerService.assignPlayerToTeam(this.assign).subscribe({
      next: (response: any) => {

        this.assigningId = null;

        if (response === true) {

          this.assignSuccessMessages[playerId] =
            'Player sold to the team.';

          this.toast.success(`${name} sold to ${this.teamName(teamId)}.`);

          this.getUnsoldPlayers();
          this.getSoldPlayers();

          if (this.showList[teamId]) {
            this.getPlayerListInTeam(teamId);
          }

        } else {

          this.assignErrorMessages[playerId] =
            'Player or team was not found. Refresh the page and try again.';
        }
      },
      error: (error: any) => {

        this.assigningId = null;
        this.assignErrorMessages[playerId] =
          this.readError(error);
        // Budgets or availability may have changed elsewhere: refresh the figures.
        this.getSoldPlayers();
        if (error && error.status === 409) {
          this.getUnsoldPlayers();
        }
      }
    });
  }

  async releasePlayerFromTeam(playerId: any, teamId?: any): Promise<void> {

    this.errorMessage = '';
    this.successMessage = '';

    const player = teamId != null && this.teamPlayers[teamId]
      ? this.teamPlayers[teamId].find((p) => p.id === playerId)
      : undefined;
    const name = player && player.name ? player.name : 'this player';

    const ok = await this.confirm.ask({
      title: `Release ${name}?`,
      message: `${name} goes back to the unsold pool and ${teamId != null ? this.teamName(teamId) : 'the team'} gets the budget back.`,
      confirmText: 'Release player'
    });

    if (!ok) {
      return;
    }

    this.releasingId = playerId;

    this.organizerService.releasePlayerFromTeam(playerId).subscribe({
      next: () => {

        this.releasingId = null;
        this.successMessage =
          'Player released back to the unsold pool.';
        this.toast.success(`${name === 'this player' ? 'Player' : name} released to the unsold pool.`);

        this.getUnsoldPlayers();
        this.getSoldPlayers();
        this.reloadOpenSquads();
      },
      error: (error: any) => {
        this.releasingId = null;
        this.errorMessage = this.readError(error);
        this.toast.error(this.errorMessage);
      }
    });
  }

  trackById(_: number, item: { id?: any }): any {
    return item.id;
  }

  private reloadOpenSquads(): void {
    Object.keys(this.showList).forEach((id) => {
      if (this.showList[+id]) {
        this.getPlayerListInTeam(+id);
      }
    });
  }

  private readError(error: any): string {

    if (error && error.status === 0) {
      return readApiError(error);
    }

    if (error && error.error) {

      if (typeof error.error === 'string') {
        return error.error;
      }

      if (error.error.message) {
        return error.error.message;
      }

      if (error.error.error) {
        return error.error.error;
      }
    }

    if (error && error.status === 400) {
      return 'Exceeds team budget.';
    }

    if (error && error.status === 409) {
      return 'Player is already assigned to a team.';
    }

    return 'The auction server rejected that action.';
  }
}
