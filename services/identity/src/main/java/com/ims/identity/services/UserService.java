package com.ims.identity.services;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

import com.ims.identity.dto.CreateUserRequestDto;
import com.ims.identity.dto.PasswordChangeRequestDto;
import com.ims.identity.dto.UpdateUserRequest;
import com.ims.identity.dto.UserResponse;
import com.ims.identity.entities.RoleType;

public interface UserService {
    UserResponse createUser(CreateUserRequestDto request);

    List<UserResponse> getAllUsers();

    List<UserResponse> getAllUsersByRole(RoleType role);

    List<UserResponse> getAllUsersWithIds(Collection<UUID> ids);

    UserResponse getUserById(UUID id);

    UserResponse getUserByEmail(String email);

    UserResponse updateUser(UUID id, UpdateUserRequest request);

    UserResponse changePassword(PasswordChangeRequestDto request);

    void deleteUser(UUID id);
}