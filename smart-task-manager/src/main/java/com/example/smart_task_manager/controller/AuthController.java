package com.example.smart_task_manager.controller;

import com.example.smart_task_manager.model.User;
import com.example.smart_task_manager.service.AuthService;
import org.springframework.web.bind.annotation.*;
import com.example.smart_task_manager.security.JwtService;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    private final AuthService service;
    private final JwtService jwtService;

    public AuthController(AuthService service,
                          JwtService jwtService) {

        this.service = service;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return service.register(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody User user) {

        service.login(
                user.getEmail(),
                user.getPassword()
        );

        return jwtService.generateToken(user.getEmail());
    }
}