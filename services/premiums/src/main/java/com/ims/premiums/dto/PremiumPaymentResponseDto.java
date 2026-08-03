package com.ims.premiums.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import com.ims.premiums.enums.PaymentStatus;
import com.ims.premiums.models.PolicySubscription;

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
