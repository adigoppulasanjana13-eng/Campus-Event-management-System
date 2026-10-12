package com.campus.event.service.impl;

import com.campus.event.config.JwtUtils;
import com.campus.event.dto.AuthRequest;
import com.campus.event.dto.AuthResponse;
import com.campus.event.dto.RegisterRequest;
import com.campus.event.dto.UserDTO;
import com.campus.event.entity.Role;
import com.campus.event.entity.User;
import com.campus.event.exception.BadRequestException;
import com.campus.event.exception.ResourceNotFoundException;
import com.campus.event.repository.UserRepo;
import com.campus.event.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthServiceImpl(AuthenticationManager authenticationManager,
                           UserRepo userRepo,
                           PasswordEncoder passwordEncoder,
                           JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        String jwt = jwtUtils.generateJwtToken(authentication, user.getId(), user.getName(), user.getRole().name());

        return new AuthResponse(
                jwt,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getDepartment(),
                user.getStudentId()
        );
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepo.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered: " + request.getEmail());
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : Role.ROLE_STUDENT);
        user.setDepartment(request.getDepartment());
        user.setStudentId(request.getStudentId());

        User savedUser = userRepo.save(user);

        String jwt = jwtUtils.generateTokenFromUsername(
                savedUser.getEmail(),
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getRole().name()
        );

        return new AuthResponse(
                jwt,
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                savedUser.getDepartment(),
                savedUser.getStudentId()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO getCurrentUser(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return UserDTO.fromEntity(user);
    }
}
