package com.ims.claims.dto;

import java.time.LocalDate;
import java.util.UUID;

import com.ims.claims.enums.UserGender;
import com.ims.claims.models.Address;

import lombok.Builder;

@Builder
public record UserResponse(
		UUID id,
		String firstName,
		String lastName,
		String email,
		String phone,
		UserGender gender,
		Address address,
		LocalDate dob,
		boolean enabled
) {
}