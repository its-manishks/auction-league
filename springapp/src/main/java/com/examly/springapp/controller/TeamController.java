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

import com.examly.springapp.entity.Team;
import com.examly.springapp.service.TeamService;

@RestController
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @PostMapping("/api/team")
    public Team createTeam(@Valid @RequestBody Team team) {
        return teamService.createTeam(team);
    }

    @PutMapping("/api/team/{teamId}")
    public Team updateTeam(
            @PathVariable Long teamId,
            @Valid @RequestBody Team team) {

        return teamService.updateTeam(teamId, team);
    }

    @GetMapping("/api/team")
    public List<Team> getAllTeams() {
        return teamService.getAllTeams();
    }

    @GetMapping("/api/team/{teamId}")
    public Team getTeamById(@PathVariable Long teamId) {
        return teamService.getTeamById(teamId);
    }

    @DeleteMapping("/api/team/{teamId}")
    public boolean deleteTeam(@PathVariable Long teamId) {
        return teamService.deleteTeam(teamId);
    }
}