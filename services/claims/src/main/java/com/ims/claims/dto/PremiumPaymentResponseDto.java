package com.ims.claims.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import com.ims.claims.enums.PaymentStatus;
import com.ims.claims.models.PolicySubscription;

import lombok.Builder;

@Builder
public record PremiumPaymentResponseDto(
        UUID id,
        PolicySubscription subscription,
        String method,
        Integer amountPayed,
        Integer premiumAmount,
        PaymentStatus status,
        LocalDate dueDate,
        LocalDateTime paymentTime,
        LocalDateTime createdAt
) {

}
