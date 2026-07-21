package com.ims.identity.dto;

import com.ims.identity.entities.RoleType;

public record CreateUserRequest(String firstName,
        String lastName,
        String email,
        String password,
        String dob,
        String phone,
        String address,
        RoleType role) {
}
