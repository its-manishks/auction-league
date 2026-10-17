package com.examly.springapp.service;

import java.util.List;

import com.examly.springapp.entity.Player;

public interface PlayerService {

    Player createPlayer(Player player);

    Player updatePlayer(Long playerId, Player player);

    List<Player> getAllPlayers();

    Player getPlayerById(Long playerId);

    boolean deletePlayer(Long playerId);
}