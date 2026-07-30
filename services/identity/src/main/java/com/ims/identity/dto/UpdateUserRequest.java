package com.ims.identity.dto;

import java.time.LocalDate;

import com.ims.identity.entities.Address;

import jakarta.validation.constraints.NotNull;

public record UpdateUserRequest(@NotNull String firstName,
		@NotNull String lastName,
		@NotNull String phone,
		@NotNull Address address,
		LocalDate dob,
		boolean enabled) {
}
