package com.ims.identity.dto;

public record UpdateUserRequest(String firstName,
        String lastName,
        String phone,
        String address,
        String dob,
        String enabled) {

}
