package com.ims.identity.dto;

public record LoginResponseDto(
		String accessToken,
		String refreshToken,
		String tokenType) {
}