package com.examly.springapp.service;

import java.util.List;

import com.examly.springapp.entity.Player;

public interface OrganizerService {

    List<Player> getUnsoldPlayers();

    List<Player> getSoldPlayers();

    boolean assignPlayerToTeam(Long playerId, Long teamId);

    void releasePlayerFromTeam(Long playerId);

    List<Player> getPlayerListByTeamId(Long teamId);
}