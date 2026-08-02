package com.ims.premiums.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.ims.premiums.enums.ResponseStatus;
import com.ims.premiums.models.Policy;

public record FetchAllPoliciesByIdsResponseDto(
        ResponseStatus status,
        List<Policy> body,
        LocalDateTime timestamp) {

}
