package com.ims.identity.dto;

public record LoginResponse(
        String accessToken,
        String refreshToken,
        String tokenType) {
}