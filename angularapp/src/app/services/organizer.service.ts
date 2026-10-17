import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Player } from '../models/player.model';
import { Team } from '../models/team.model';
import { AssignPlayer } from '../models/assign-player.model';
import { API_BASE_URL } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class OrganizerService {

  public baseUrl = API_BASE_URL;

  constructor(private http: HttpClient) { }

  getUnsoldPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.baseUrl}/organizer/unsold-players`);
  }

  /** Existing backend endpoint, used to show each team's spent / remaining purse. */
  getSoldPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.baseUrl}/organizer/sold-players`);
  }

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.baseUrl}/team`);
  }

  assignPlayerToTeam(assign: AssignPlayer): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/organizer/assign-player?playerId=${assign.playerId}&teamId=${assign.teamId}`,
      null
    );
  }

  releasePlayerFromTeam(playerId: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/organizer/release-player/${playerId}`, null);
  }

  getPlayerListInTeam(teamId: any): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.baseUrl}/organizer/player-list/${teamId}`);
  }
}
