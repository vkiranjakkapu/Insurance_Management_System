package com.ims.claims.dto;

import java.util.List;
import java.util.UUID;

import com.ims.claims.enums.ClaimStatus;

public record CreateClaimRequestDto(
        UUID subscriptionId,
        String reason,
        List<ClaimProofDto> proofs,
        ClaimStatus status) {

}
