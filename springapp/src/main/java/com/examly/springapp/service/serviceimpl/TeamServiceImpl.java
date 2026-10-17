package com.examly.springapp.service.serviceimpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.examly.springapp.entity.Player;
import com.examly.springapp.entity.Team;
import com.examly.springapp.repository.TeamRepo;
import com.examly.springapp.service.TeamService;
 
@Service
public class TeamServiceImpl implements TeamService {

    @Autowired
    private TeamRepo teamRepository;

    @Override
    public Team createTeam(Team team) {
        return teamRepository.save(team);
    }

    @Override
    public Team updateTeam(Long teamId, Team team) {

        Team existingTeam = teamRepository.findById(teamId).orElse(null);

        if (existingTeam != null) {
            existingTeam.setName(team.getName());
            existingTeam.setMaximumBudget(team.getMaximumBudget());

            return teamRepository.save(existingTeam);
        }

        return null;
    }

    @Override
    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    @Override
    public Team getTeamById(Long teamId) {
        return teamRepository.findById(teamId).orElse(null);
    }

    @Override
    @Transactional
    public boolean deleteTeam(Long teamId) {

        Team team = teamRepository.findById(teamId).orElse(null);

        if (team == null) {
            return false;
        }

        // Team.players uses CascadeType.ALL, so deleting a team used to delete
        // every player it had bought. Release them back to the unsold pool first.
        List<Player> players = team.getPlayers();

        if (players != null) {
            for (Player player : players) {
                if (player != null) {
                    player.setTeam(null);
                    player.setSold(false);
                }
            }
            players.clear();
        }

        teamRepository.delete(team);
        return true;
    }
}