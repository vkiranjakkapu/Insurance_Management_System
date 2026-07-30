package com.ims.identity.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;

public record UpdateUserRequest(@NotNull String firstName,
		@NotNull String lastName,
		@NotNull String phone,
		@NotNull AddressDto address,
		LocalDate dob,
		boolean enabled) {
}
