package com.examly.springapp.controller;

import com.examly.springapp.entity.Team;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class TestController {

    @GetMapping("/api/test/welcome")
    public String welcome() {
        return "Welcome to Spring Boot Project";
    }

    @GetMapping("/api/test/team")
    public List<Team> getTeam() {

        List<Team> teams = new ArrayList<>();

        Team team = new Team(
                1L,
                "Mumbai Indians",
                1000.0,
                null
        );

        teams.add(team);

        return teams;
    }
}