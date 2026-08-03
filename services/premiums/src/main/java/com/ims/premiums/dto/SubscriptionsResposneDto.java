package com.ims.premiums.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.ims.premiums.enums.SubscriptionStatus;
import com.ims.premiums.models.Policy;
import com.ims.premiums.models.User;

import lombok.Builder;

@Builder
public record SubscriptionsResposneDto(
        UUID id,
        User customer,
        String customerName,
        Policy policy,
        String policyId,
        String policyType,
        LocalDate startDate,
        LocalDate endDate,
        LocalDate expiry,
        List<PremiumPaymentResponseDto> payments,
        SubscriptionStatus status,
        LocalDateTime acceptanceTime,
        User agent,
        String agentEmail,
        LocalDateTime updatedAt,
        LocalDateTime createdAt
) {

}
