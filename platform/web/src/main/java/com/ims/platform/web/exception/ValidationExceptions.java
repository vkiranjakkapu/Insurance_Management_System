package com.ims.platform.web.exception;

public enum ValidationExceptions implements ErrorDefinition {

    APPLICATION_ERROR(
            "APPLICATION_ERROR",
            "APP-0000",
            "Application error."),

    VALIDATION_ERROR(
            "VALIDATION_ERROR",
            "VAL-2001",
            "Validation failed.");

    private final String errorName;

    private final String errorCode;

    private final String errorMessage;

    ValidationExceptions(
            String errorName,
            String errorCode,
            String errorMessage) {

        this.errorName = errorName;
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
    }

    @Override
    public String getErrorName() {
        return errorName;
    }

    @Override
    public String getErrorCode() {
        return errorCode;
    }

    @Override
    public String getErrorMessage() {
        return errorMessage;
    }
}