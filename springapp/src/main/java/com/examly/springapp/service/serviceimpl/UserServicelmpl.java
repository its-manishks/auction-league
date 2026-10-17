package com.examly.springapp.service.serviceimpl;

import java.util.List;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.examly.springapp.dto.AuthResponse;
import com.examly.springapp.dto.LoginRequest;
import com.examly.springapp.entity.User;
import com.examly.springapp.exception.UsernameAlreadyExistsException;
import com.examly.springapp.repository.UserRepo;
import com.examly.springapp.security.JwtUtil;
import com.examly.springapp.service.UserService;

@Service
public class UserServicelmpl implements UserService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public UserServicelmpl(UserRepo userRepo,
                            PasswordEncoder passwordEncoder,
                            AuthenticationManager authenticationManager,
                            JwtUtil jwtUtil) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public User registerUser(User user) {
        // Duplicate usernames would make findByUsername() return two rows and
        // permanently break login for that account, so reject them up front.
        if (user.getUsername() != null && userRepo.existsByUsername(user.getUsername())) {
            throw new UsernameAlreadyExistsException("Username is already taken");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepo.save(user);
    }

    @Override
    public List<User> getAllUser() {
        return userRepo.findAll();
    }

    @Override
    public AuthResponse loginUser(LoginRequest request) {

        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
        } catch (AuthenticationException e) {
            throw new BadCredentialsException("Invalid username or password");
        }

        User user = userRepo.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

        return new AuthResponse(token, user.getUsername(), user.getRole());
    }
}