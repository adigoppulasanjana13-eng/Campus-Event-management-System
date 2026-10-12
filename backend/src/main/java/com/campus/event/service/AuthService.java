package com.campus.event.service;

import com.campus.event.dto.AuthRequest;
import com.campus.event.dto.AuthResponse;
import com.campus.event.dto.RegisterRequest;
import com.campus.event.dto.UserDTO;

public interface AuthService {

    AuthResponse login(AuthRequest request);

    AuthResponse register(RegisterRequest request);

    UserDTO getCurrentUser(String email);
}
