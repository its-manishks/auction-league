package com.examly.springapp.service;

import java.util.List;

import com.examly.springapp.dto.AuthResponse;
import com.examly.springapp.dto.LoginRequest;
import com.examly.springapp.entity.User;

public interface UserService {

    User registerUser(User user);

    AuthResponse loginUser(LoginRequest request);

    List<User> getAllUser();
}