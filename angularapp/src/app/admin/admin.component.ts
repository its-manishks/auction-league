import { Component, OnInit, ViewChild } from '@angular/core';

import { AdminService } from '../services/admin.service';
import { ToastService } from '../services/toast.service';
import { ConfirmService } from '../services/confirm.service';
import { readApiError } from '../services/api-error';
import { Team } from '../models/team.model';
import { Player } from '../models/player.model';
import { TeamComponent } from '../team/team.component';
import { PlayerComponent } from '../player/player.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  @ViewChild(TeamComponent) teamList?: TeamComponent;
  @ViewChild(PlayerComponent) playerList?: PlayerComponent;

  teams: Team[] = [];
  players: Player[] = [];

  newTeam: Team = { name: '', maximumBudget: 0 };
  editedTeam: Team | null = null;

  newPlayer: Player = { name: '', age: 0, category: 'Batsman', biddingPrice: 0 };
  editedPlayer: Player | null = null;

  errorMessage = '';

  activeTab: 'teams' | 'players' = 'teams';

  loadingTeams = false;
  loadingPlayers = false;
  teamsError = '';
  playersError = '';
  savingTeam = false;
  savingPlayer = false;
  highlightTeamId: number | null = null;
  highlightPlayerId: any = null;

  /** Derived from the player list: money committed and squad size per team. */
  spentByTeam: { [teamId: number]: number } = {};
  squadSize: { [teamId: number]: number } = {};

  constructor(
    private adminService: AdminService,
    private toast: ToastService,
    private confirm: ConfirmService
  ) { }

  ngOnInit(): void {
    this.getTeams();
    this.getPlayers();
  }

  /* ---------- Summary figures ---------- */

  get soldCount(): number {
    return this.players.filter((p) => p.sold).length;
  }

  get unsoldCount(): number {
    return this.players.length - this.soldCount;
  }

  get totalBudget(): number {
    return this.teams.reduce((sum, t) => sum + (Number(t.maximumBudget) || 0), 0);
  }

  get totalSpent(): number {
    return Object.keys(this.spentByTeam).reduce((sum, id) => sum + this.spentByTeam[+id], 0);
  }

  retryAll(): void {
    this.getTeams();
    this.getPlayers();
  }

  /* ---------- Teams ---------- */

  getTeams(): void {
    this.loadingTeams = true;
    this.teamsError = '';
    this.adminService.getTeams().subscribe(
      (teams: Team[]) => {
        this.teams = teams || [];
        this.loadingTeams = false;
      },
      (error) => {
        this.loadingTeams = false;
        this.teamsError = readApiError(error, 'Teams could not be loaded.');
        this.errorMessage = 'Teams could not be loaded. Check that the server is running.';
      }
    );
  }

  createTeam(team?: Team): void {
    const payload = team || this.newTeam;

    if (!payload.name || this.savingTeam) {
      return;
    }

    this.savingTeam = true;
    this.adminService.createTeam(payload).subscribe(
      (created: Team) => {
        this.savingTeam = false;
        this.newTeam = { name: '', maximumBudget: 0 };
        this.teamList?.closeForm();
        this.highlightTeamId = created && created.id != null ? created.id : null;
        this.toast.success(`Team "${payload.name}" added.`);
        this.getTeams();
      },
      (error) => {
        this.savingTeam = false;
        this.teamList?.showFormError(readApiError(error, 'The team could not be created.'));
      }
    );
  }

  editTeam(team: Team): void {
    this.editedTeam = { ...team };
  }

  saveEditedTeam(team?: Team): void {
    const payload = team || this.editedTeam;

    if (!payload || payload.id == null || this.savingTeam) {
      return;
    }

    this.savingTeam = true;
    this.adminService.updateTeam(payload.id, payload).subscribe(
      () => {
        this.savingTeam = false;
        this.editedTeam = null;
        this.teamList?.closeForm();
        this.highlightTeamId = payload.id!;
        this.toast.success(`Team "${payload.name}" updated.`);
        this.getTeams();
        // Player rows embed their team's name, so refresh them too.
        this.getPlayers();
      },
      (error) => {
        this.savingTeam = false;
        this.teamList?.showFormError(readApiError(error, 'The team could not be saved.'));
      }
    );
  }

  cancelEditTeam(): void {
    this.editedTeam = null;
  }

  async deleteTeam(teamId: number): Promise<void> {
    const team = this.teams.find((t) => t.id === teamId);
    const squad = this.squadSize[teamId] || 0;
    const name = team && team.name ? team.name : 'this team';

    const ok = await this.confirm.ask({
      title: `Delete ${name}?`,
      message: squad > 0
        ? `${squad} ${squad === 1 ? 'player goes' : 'players go'} back to the unsold pool. This cannot be undone.`
        : 'This cannot be undone.',
      confirmText: 'Delete team',
      danger: true
    });

    if (!ok) {
      return;
    }

    this.adminService.deleteTeam(teamId).subscribe(
      () => {
        this.toast.success(`Team "${name}" deleted.`);
        this.getTeams();
        this.getPlayers();
      },
      (error) => this.toast.error(readApiError(error, 'The team could not be deleted.'))
    );
  }

  /* ---------- Players ---------- */

  getPlayers(): void {
    this.loadingPlayers = true;
    this.playersError = '';
    this.adminService.getPlayers().subscribe(
      (players: Player[]) => {
        this.players = players || [];
        this.loadingPlayers = false;
        this.computeTeamTotals();
      },
      (error) => {
        this.loadingPlayers = false;
        this.playersError = readApiError(error, 'Players could not be loaded.');
        this.errorMessage = 'Players could not be loaded. Check that the server is running.';
      }
    );
  }

  createPlayer(player?: Player): void {
    const payload = player || this.newPlayer;

    if (!payload.name || this.savingPlayer) {
      return;
    }

    this.savingPlayer = true;
    this.adminService.createPlayer(payload).subscribe(
      (created: Player) => {
        this.savingPlayer = false;
        this.newPlayer = { name: '', age: 0, category: 'Batsman', biddingPrice: 0 };
        this.playerList?.closeForm();
        this.highlightPlayerId = created ? created.id : null;
        this.toast.success(`${payload.name} added to the player pool.`);
        this.getPlayers();
      },
      (error) => {
        this.savingPlayer = false;
        this.playerList?.showFormError(readApiError(error, 'The player could not be created.'));
      }
    );
  }

  editPlayer(player: Player): void {
    this.editedPlayer = { ...player };
  }

  saveEditedPlayer(player?: Player): void {
    const payload = player || this.editedPlayer;

    if (!payload || payload.id == null || this.savingPlayer) {
      return;
    }

    this.savingPlayer = true;
    this.adminService.updatePlayer(payload.id, payload).subscribe(
      () => {
        this.savingPlayer = false;
        this.editedPlayer = null;
        this.playerList?.closeForm();
        this.highlightPlayerId = payload.id;
        this.toast.success(`${payload.name} updated.`);
        this.getPlayers();
      },
      (error) => {
        this.savingPlayer = false;
        this.playerList?.showFormError(readApiError(error, 'The player could not be saved.'));
      }
    );
  }

  cancelEditPlayer(): void {
    this.editedPlayer = null;
  }

  async deletePlayer(playerId: any): Promise<void> {
    const player = this.players.find((p) => p.id === playerId);
    const name = player && player.name ? player.name : 'this player';
    const soldTo = player && player.sold && player.team ? player.team.name : '';

    const ok = await this.confirm.ask({
      title: `Delete ${name}?`,
      message: soldTo
        ? `${name} is in ${soldTo}'s squad. Deleting removes them from the squad and frees that budget. This cannot be undone.`
        : `${name} will be removed from the player pool. This cannot be undone.`,
      confirmText: 'Delete player',
      danger: true
    });

    if (!ok) {
      return;
    }

    this.adminService.deletePlayer(playerId).subscribe(
      () => {
        this.toast.success(`${name} deleted.`);
        this.getPlayers();
      },
      (error) => this.toast.error(readApiError(error, 'The player could not be deleted.'))
    );
  }

  /* ---------- Helpers ---------- */

  private computeTeamTotals(): void {
    const spent: { [teamId: number]: number } = {};
    const squad: { [teamId: number]: number } = {};

    this.players.forEach((p) => {
      if (p.sold && p.team && p.team.id != null) {
        spent[p.team.id] = (spent[p.team.id] || 0) + (Number(p.biddingPrice) || 0);
        squad[p.team.id] = (squad[p.team.id] || 0) + 1;
      }
    });

    this.spentByTeam = spent;
    this.squadSize = squad;
  }
}
