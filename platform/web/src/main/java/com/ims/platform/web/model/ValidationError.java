package com.ims.platform.web.model;

public record ValidationError(
		String field,
		Object rejectedValue,
		String message) {
}