package com.ims.policies.dto;

import java.time.Period;

import com.ims.policies.enums.PolicyStatus;
import com.ims.policies.enums.PolicyType;
import com.ims.policies.models.Document;

import lombok.Builder;

@Builder
public record PolicyResponseDto(
        Long id,
        String policyId,
        PolicyType policyType,
        String description,
        Integer coverageAmount,
        Period coverageDuration,
        Period premiumsDuration,
        PolicyStatus status,
        Document document) {

}
