package com.ims.claims.dto;

import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record CreateClaimRequestDto(
		@NotNull UUID subscriptionId,
		@NotNull UUID customerId,
		@NotNull String reason,
		@NotEmpty List<ClaimProofDto> proofs) {

}
