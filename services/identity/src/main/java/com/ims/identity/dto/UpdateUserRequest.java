package com.ims.identity.dto;

import jakarta.validation.constraints.NotNull;

public record UpdateUserRequest(
		@NotNull String firstName,
		@NotNull String lastName,
		@NotNull String phone,
		@NotNull AddressDto address,
		boolean enabled) {
}
