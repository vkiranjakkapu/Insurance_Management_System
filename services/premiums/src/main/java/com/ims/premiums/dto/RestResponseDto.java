package com.ims.premiums.dto;

import java.time.LocalDateTime;

import com.ims.premiums.enums.ResponseStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RestResponseDto<T> {

    @Builder.Default()
    private ResponseStatus status = ResponseStatus.SUCCESS;

    private T body;

    @Builder.Default()
    private LocalDateTime timestamp = LocalDateTime.now();
}