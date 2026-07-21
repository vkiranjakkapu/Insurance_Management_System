package com.ims.identity.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

import com.ims.identity.entities.Address;
import com.ims.identity.entities.RoleType;

import lombok.Builder;

@Builder
public record UserResponse(Long id,
		String firstName,
		String lastName,
		String email,
		String phone,
		Address address,
		LocalDate dob,
		boolean enabled,
		Set<RoleType> roles,
		LocalDateTime createdAt,
		LocalDateTime updatedAt) {
}