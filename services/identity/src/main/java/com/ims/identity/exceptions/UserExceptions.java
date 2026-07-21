package com.ims.identity.exceptions;

import com.ims.platform.web.exception.ErrorDefinition;

public enum UserExceptions implements ErrorDefinition {

    RESOURCE_NOT_FOUND("RESOURCE_NOT_FOUND", "BUS-2004", ""),
    DUPLICATE_RESOURCE_FOUND("DUPLICATE_RESOURCE_FOUND", "BUS-2006", "Resource already exists in records.");

    private final String errorName;
    private final String errorCode;
    private final String errorMessage;

    UserExceptions(String errorName,
            String errorCode,
            String errorMessage) {
        this.errorName = errorName;
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
    }

    @Override
    public String getErrorName() {
        return this.errorName;
    }

    @Override
    public String getErrorCode() {
        return this.errorCode;
    }

    @Override
    public String getErrorMessage() {
        return this.errorMessage;
    }

}