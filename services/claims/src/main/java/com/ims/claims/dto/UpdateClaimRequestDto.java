package com.ims.claims.dto;

import com.ims.claims.enums.ClaimStatus;

public record UpdateClaimRequestDto(
        Long claimId,
        ClaimStatus status) {

}
