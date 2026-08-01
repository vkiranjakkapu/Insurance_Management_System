package com.ims.claims.dto;

import java.time.LocalDateTime;

import com.ims.claims.enums.ResponseStatus;
import com.ims.claims.models.PolicySubscription;

import lombok.Builder;

@Builder
public record PolicySubscriptionRequestDto(
		ResponseStatus status,
		PolicySubscription body,
		LocalDateTime timestamp) {
}
