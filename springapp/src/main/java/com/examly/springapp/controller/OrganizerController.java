package com.examly.springapp.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.examly.springapp.entity.Player;
import com.examly.springapp.service.OrganizerService;

@RestController
public class OrganizerController {

    private final OrganizerService organizerService;

    public OrganizerController(OrganizerService organizerService) {
        this.organizerService = organizerService;
    }

    @PostMapping("/api/organizer/assign-player")
    public boolean assignPlayerToTeam(
            @RequestParam Long playerId,
            @RequestParam Long teamId) {

        return organizerService.assignPlayerToTeam(playerId, teamId);
    }

    @GetMapping("/api/organizer/unsold-players")
    public List<Player> getUnsoldPlayers() {

        return organizerService.getUnsoldPlayers();
    }

    @GetMapping("/api/organizer/sold-players")
    public List<Player> getSoldPlayers() {

        return organizerService.getSoldPlayers();
    }

    @PutMapping("/api/organizer/release-player/{playerId}")
    public boolean releasePlayerFromTeam(
            @PathVariable Long playerId) {

        organizerService.releasePlayerFromTeam(playerId);

        return true;
    }

    @GetMapping("/api/organizer/player-list/{teamId}")
    public List<Player> getPlayerListByTeamId(
            @PathVariable Long teamId) {

        return organizerService.getPlayerListByTeamId(teamId);
    }
}