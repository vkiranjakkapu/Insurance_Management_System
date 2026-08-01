package com.ims.premiums.dto;

import java.time.LocalDateTime;

import com.ims.premiums.enums.ResponseStatus;
import com.ims.premiums.models.Policy;

public record FetchPolicyRequestDto(ResponseStatus status,
        Policy policy,
        LocalDateTime timestamp) {

}
