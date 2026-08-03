package com.ims.claims.dto;

import java.time.LocalDateTime;

import com.ims.claims.enums.ResponseStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FetchSubscriptionResponseDto {

    @Builder.Default()
    private ResponseStatus status = ResponseStatus.SUCCESS;

    private SubscriptionsResposneDto body;

    @Builder.Default()
    private LocalDateTime timestamp = LocalDateTime.now();

}
