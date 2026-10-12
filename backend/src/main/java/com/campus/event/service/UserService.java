package com.campus.event.service;

import com.campus.event.dto.UserDTO;

import java.util.List;

public interface UserService {

    UserDTO getUserById(Long id);

    UserDTO getUserByEmail(String email);

    List<UserDTO> getAllUsers();
}
