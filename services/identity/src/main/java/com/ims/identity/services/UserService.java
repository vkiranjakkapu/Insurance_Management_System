package com.ims.identity.services;

import java.util.List;

import com.ims.identity.dto.CreateUserRequest;
import com.ims.identity.dto.UpdateUserRequest;
import com.ims.identity.dto.UserResponse;

public interface UserService {
    UserResponse createUser(CreateUserRequest request);

    List<UserResponse> getAllUsers();

    UserResponse getUserById(Long id);

    UserResponse getUserByEmail(String email);

    UserResponse updateUser(Long id, UpdateUserRequest request);

    void deleteUser(Long id);
}