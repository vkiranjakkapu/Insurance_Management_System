package com.ims.identity.dto;

import java.time.LocalDate;

import com.ims.identity.entities.Address;
import com.ims.identity.entities.RoleType;

public record CreateUserRequest(String firstName,
        String lastName,
        String email,
        String password,
        LocalDate dob,
        String phone,
        Address address,
        RoleType role) {
}
