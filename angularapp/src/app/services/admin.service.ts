import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Team } from '../models/team.model';
import { Player } from '../models/player.model';
import { API_BASE_URL } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  public baseUrl = API_BASE_URL;

  constructor(private http: HttpClient) { }

  /* ---------- Team ---------- */

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.baseUrl}/team`);
  }

  createTeam(team: Team): Observable<Team> {
    return this.http.post<Team>(`${this.baseUrl}/team`, team);
  }

  updateTeam(teamId: number, team: Team): Observable<Team> {
    return this.http.put<Team>(`${this.baseUrl}/team/${teamId}`, team);
  }

  deleteTeam(teamId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/team/${teamId}`);
  }

  /* ---------- Player ---------- */

  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.baseUrl}/player`);
  }

  createPlayer(player: Player): Observable<Player> {
    return this.http.post<Player>(`${this.baseUrl}/player`, player);
  }

  updatePlayer(playerId: any, player: Player): Observable<Player> {
    return this.http.put<Player>(`${this.baseUrl}/player/${playerId}`, player);
  }

  deletePlayer(playerId: any): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/player/${playerId}`);
  }
}
