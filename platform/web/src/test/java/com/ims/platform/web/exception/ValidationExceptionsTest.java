package com.ims.platform.web.exception;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class ValidationExceptionsTest {

	@Test
	void shouldReturnValidationErrorProperties() {

		ValidationExceptions exception = ValidationExceptions.VALIDATION_ERROR;

		assertEquals(
				"VALIDATION_ERROR",
				exception.getErrorName());

		assertEquals(
				"VAL-2001",
				exception.getErrorCode());

		assertEquals(
				"Validation failed.",
				exception.getErrorMessage());
	}

	@Test
	void shouldReturnApplicationErrorProperties() {

		ValidationExceptions exception = ValidationExceptions.APPLICATION_ERROR;

		assertEquals(
				"APPLICATION_ERROR",
				exception.getErrorName());

		assertEquals(
				"APP-0000",
				exception.getErrorCode());

		assertEquals(
				"Application error.",
				exception.getErrorMessage());
	}
}