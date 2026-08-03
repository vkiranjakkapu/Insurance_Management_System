package com.ims.claims.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.ims.claims.enums.ClaimStatus;
import com.ims.claims.models.Document;
import com.ims.claims.models.User;

import lombok.Builder;

@Builder
public record ClaimResponseDto(
		Long id,
		SubscriptionsResposneDto subscription,
		String claimId,
		String reason,
		List<Document> proofs,
		ClaimStatus status,
		User customer,
		User agent,
		User resolver,
		LocalDateTime updatedAt,
		LocalDateTime createdAt) {

}
