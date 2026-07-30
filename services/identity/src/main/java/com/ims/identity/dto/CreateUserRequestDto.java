package com.ims.identity.dto;

import java.time.LocalDate;

import com.ims.identity.entities.RoleType;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateUserRequestDto(
		@Email @NotBlank String email,
		@NotBlank String firstName,
		@NotBlank String lastName,
		@NotBlank String password,
		@NotNull LocalDate dob,
		@NotBlank String phone,
		@NotNull AddressDto address,
		@NotNull RoleType role) {
}
