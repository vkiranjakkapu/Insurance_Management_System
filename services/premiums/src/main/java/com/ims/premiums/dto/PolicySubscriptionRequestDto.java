package com.ims.premiums.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record PolicySubscriptionRequestDto(
        UUID customerId,
        List<Long> policyIds,
        Integer premiumAmount,
        LocalDate startDate) {
}
