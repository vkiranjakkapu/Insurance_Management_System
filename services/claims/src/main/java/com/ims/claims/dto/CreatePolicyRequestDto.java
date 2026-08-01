package com.ims.claims.dto;

import java.time.Period;

import com.ims.claims.enums.PolicyType;

public record CreatePolicyRequestDto(
        PolicyType policyType,
        String description,
        Integer coverageAmount,
        Period coverageDuration,
        Period premiumsDuration,
        Long documentId) {

}
