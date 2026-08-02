package com.ims.policies.dto;

import java.util.List;

import lombok.Builder;

@Builder
public record FetchAllPoliciesByIdsRequestDto(
		List<Long> policyIds) {

}
