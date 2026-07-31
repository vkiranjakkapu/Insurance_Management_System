package com.ims.identity.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record AddressDto(@NotNull String street,
		@NotNull String pinCode,
		@NotNull String state,
		@NotNull String country) {

}
