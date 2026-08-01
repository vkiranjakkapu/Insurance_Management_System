package com.ims.premiums.dto;

import java.time.LocalDate;
import java.util.UUID;

public record PolicySubscriptionRequestDto(
        UUID customerId,
        Long policyId,
        Integer premiumAmount,
        LocalDate startDate) {
}
