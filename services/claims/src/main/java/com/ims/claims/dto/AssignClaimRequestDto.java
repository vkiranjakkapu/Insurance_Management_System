package com.ims.claims.dto;

import java.util.UUID;

public record AssignClaimRequestDto(
        Long claimId,
        UUID customerId,
        UUID agentId,
        String dealerName) {

}
