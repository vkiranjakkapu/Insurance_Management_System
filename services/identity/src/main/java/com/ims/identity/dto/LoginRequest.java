package com.ims.identity.dto;

public record LoginRequest(
		String email,
		String password) {
}