package com.ims.identity.dto;

import java.time.LocalDate;

import com.ims.identity.entities.RoleType;

public record CreateUserResponseDto(
		String email,
		String firstName,
		String lastName,
		String password,
		LocalDate dob,
		String phone,
		AddressDto address,
		RoleType role) {
}
