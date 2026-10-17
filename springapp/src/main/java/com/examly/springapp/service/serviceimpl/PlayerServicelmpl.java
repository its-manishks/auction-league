package com.examly.springapp.service.serviceimpl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.examly.springapp.entity.Player;
import com.examly.springapp.repository.PlayerRepo;
import com.examly.springapp.service.PlayerService;

@Service
public class PlayerServicelmpl implements PlayerService {

    private final PlayerRepo playerRepo;

    public PlayerServicelmpl(PlayerRepo playerRepo) {
        this.playerRepo = playerRepo;
    }

    @Override
    public Player createPlayer(Player player) {
        return playerRepo.save(player);
    }

    @Override
    public Player updatePlayer(Long playerId, Player player) {

        Player existingPlayer = playerRepo.findById(playerId).orElse(null);

        if (existingPlayer != null) {

            existingPlayer.setName(player.getName());
            existingPlayer.setAge(player.getAge());
            existingPlayer.setCategory(player.getCategory());
            existingPlayer.setBiddingPrice(player.getBiddingPrice());
            existingPlayer.setSold(player.isSold());

            return playerRepo.save(existingPlayer);
        }

        return null;
    }

    @Override
    public List<Player> getAllPlayers() {
        return playerRepo.findAll();
    }

    @Override
    public Player getPlayerById(Long playerId) {
        return playerRepo.findById(playerId).orElse(null);
    }

    @Override
    public boolean deletePlayer(Long playerId) {

        if (playerRepo.existsById(playerId)) {
            playerRepo.deleteById(playerId);
            return true;
        }

        return false;
    }
}