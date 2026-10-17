package com.examly.springapp.service;

import java.util.List;

import com.examly.springapp.entity.Team;

public interface TeamService {

    Team createTeam(Team team);

    Team updateTeam(Long teamId, Team team);

    List<Team> getAllTeams();

    Team getTeamById(Long teamId);

    boolean deleteTeam(Long teamId);
}