package com.ims.identity.dto;

public record RefreshTokenResponse(
        String accessToken,
        String refreshToken) {
}
