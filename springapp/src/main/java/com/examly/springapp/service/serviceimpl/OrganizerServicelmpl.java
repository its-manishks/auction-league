package com.examly.springapp.service.serviceimpl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.examly.springapp.entity.Player;
import com.examly.springapp.entity.Team;
import com.examly.springapp.exception.ExceedsTeamBudgetException;
import com.examly.springapp.exception.PlayerAlreadyAssignedException;
import com.examly.springapp.repository.PlayerRepo;
import com.examly.springapp.repository.TeamRepo;
import com.examly.springapp.service.OrganizerService;

@Service
public class OrganizerServicelmpl implements OrganizerService {

    private final PlayerRepo playerRepo;
    private final TeamRepo teamRepo;

    public OrganizerServicelmpl(PlayerRepo playerRepo, TeamRepo teamRepo) {
        this.playerRepo = playerRepo;
        this.teamRepo = teamRepo;
    }

    @Override
    public List<Player> getUnsoldPlayers() {

        List<Player> allPlayers = playerRepo.findAll();
        List<Player> unsoldPlayers = new ArrayList<>();

        for (Player player : allPlayers) {

            if (!player.isSold()) {
                unsoldPlayers.add(player);
            }
        }

        return unsoldPlayers;
    }

    @Override
    public List<Player> getSoldPlayers() {

        List<Player> allPlayers = playerRepo.findAll();
        List<Player> soldPlayers = new ArrayList<>();

        for (Player player : allPlayers) {

            if (player.isSold()) {
                soldPlayers.add(player);
            }
        }

        return soldPlayers;
    }

    @Override
    public boolean assignPlayerToTeam(Long playerId, Long teamId) {

        Player player = playerRepo.findById(playerId).orElse(null);
        Team team = teamRepo.findById(teamId).orElse(null);

        if (player == null || team == null) {
            return false;
        }

        if (player.isSold()) {
            throw new PlayerAlreadyAssignedException(
                    "Player is already assigned to a team");
        }

        double totalBudget = 0;

        List<Player> players = team.getPlayers();

        if (players != null) {

            for (Player p : players) {

                if (p != null) {
                    totalBudget += p.getBiddingPrice();
                }
            }
        }

        double newTotalBudget = totalBudget + player.getBiddingPrice();

        if (newTotalBudget > team.getMaximumBudget()) {
            throw new ExceedsTeamBudgetException(
                    "Exceeds team budget");
        }

        player.setTeam(team);
        player.setSold(true);

        playerRepo.save(player);

        return true;
    }

    @Override
    public void releasePlayerFromTeam(Long playerId) {

        Player player = playerRepo.findById(playerId).orElse(null);

        if (player != null) {

            player.setTeam(null);
            player.setSold(false);

            playerRepo.save(player);
        }
    }

    @Override
    public List<Player> getPlayerListByTeamId(Long teamId) {

        List<Player> allPlayers = playerRepo.findAll();
        List<Player> result = new ArrayList<>();

        for (Player player : allPlayers) {

            if (player.getTeam() != null
                    && player.getTeam().getId().equals(teamId)) {

                result.add(player);
            }
        }

        return result;
    }
}