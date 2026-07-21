package com.ims.identity.dto;

import java.time.LocalDate;

import com.ims.identity.entities.Address;

public record UpdateUserRequest(String firstName,
		String lastName,
		String phone,
		Address address,
		LocalDate dob,
		boolean enabled) {
}
