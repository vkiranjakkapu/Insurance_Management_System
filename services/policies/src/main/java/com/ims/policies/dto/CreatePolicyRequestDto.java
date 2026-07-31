package com.ims.policies.dto;

import java.time.Period;

import com.ims.policies.enums.PolicyType;

public record CreatePolicyRequestDto(
        PolicyType policyType,
        String description,
        Integer coverageAmount,
        Period coverageDuration,
        Period premiumsDuration,
        Long documentId) {

}
