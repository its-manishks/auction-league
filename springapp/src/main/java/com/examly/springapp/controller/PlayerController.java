package com.examly.springapp.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.examly.springapp.entity.Player;
import com.examly.springapp.service.PlayerService;

@RestController
public class PlayerController {

    private final PlayerService playerService;

    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @PostMapping("/api/player")
    public Player createPlayer(@Valid @RequestBody Player player) {
        return playerService.createPlayer(player);
    }

    @PutMapping("/api/player/{playerId}")
    public Player updatePlayer(
            @PathVariable Long playerId,
            @Valid @RequestBody Player player) {

        return playerService.updatePlayer(playerId, player);
    }

    @GetMapping("/api/player")
    public List<Player> getAllPlayers() {
        return playerService.getAllPlayers();
    }

    @GetMapping("/api/player/{playerId}")
    public Player getPlayerById(@PathVariable Long playerId) {
        return playerService.getPlayerById(playerId);
    }

    @DeleteMapping("/api/player/{playerId}")
    public boolean deletePlayer(@PathVariable Long playerId) {
        return playerService.deletePlayer(playerId);
    }
}