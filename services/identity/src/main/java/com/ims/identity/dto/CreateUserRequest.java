package com.ims.identity.dto;

import java.time.LocalDate;

import com.ims.identity.entities.Address;
import com.ims.identity.entities.RoleType;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateUserRequest(
		@NotBlank String firstName,

		@NotBlank String lastName,

		@Email @NotBlank String email,

		@NotBlank String password,

		@NotNull LocalDate dob,

		@NotBlank String phone,

		@NotNull Address address,

		@NotNull RoleType role) {
}
