package com.ims.premiums.dto;

import java.time.LocalDate;
import java.util.UUID;

import com.ims.premiums.enums.UserGender;
import com.ims.premiums.models.Address;

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