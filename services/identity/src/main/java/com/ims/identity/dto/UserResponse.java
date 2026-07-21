package com.ims.identity.dto;

import java.time.LocalDateTime;
import java.util.Set;

import com.ims.identity.entities.RoleType;

public record UserResponse(String id,
        String firstName,
        String lastName,
        String email,
        String phone,
        String address,
        String dob,
        String enabled,
        Set<RoleType> roles,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {

}
