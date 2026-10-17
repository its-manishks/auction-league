package com.examly.springapp.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.examly.springapp.dto.AuthResponse;
import com.examly.springapp.dto.LoginRequest;
import com.examly.springapp.entity.User;
import com.examly.springapp.service.UserService;

@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/api/user/register")
    public User registerUser(@Valid @RequestBody User user) {
        return userService.registerUser(user);
    }

    @PostMapping("/api/user/login")
    public AuthResponse loginUser(@Valid @RequestBody LoginRequest request) {
        return userService.loginUser(request);
    }

    @GetMapping("/api/user")
    public List<User> getAllUser() {
        return userService.getAllUser();
    }
}