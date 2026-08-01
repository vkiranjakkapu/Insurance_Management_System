package com.ims.claims.enums;

import com.ims.platform.web.exception.ErrorDefinition;

/**
 * 
 * IdentityExceptions:
 * 
 * @Available
 * <li>BAD_CREDENTIALS</li> 
 *  <li>USER_NOT_FOUND</li> 
 *  <li>RESOURCE_NOT_FOUND</li>
 *  <li>DUPLICATE_RESOURCE_FOUND</li>
 */
public enum IdentityExceptions implements ErrorDefinition {

    // * Security Errors
    BAD_CREDENTIALS("BAD_CREDENTIALS", "SEC-4013", "Invalid Credentials Supplied."),
    
    // * User Errors
    USER_NOT_FOUND("USER_NOT_FOUND", "BUS-2002", "User with given details not found in records"),
    RESOURCE_NOT_FOUND("RESOURCE_NOT_FOUND", "BUS-2004", "Resource supplied not found"),
    DUPLICATE_RESOURCE_FOUND("DUPLICATE_RESOURCE_FOUND", "BUS-2006", "Resource already exists in records.");

    private final String errorName;
    private final String errorCode;
    private final String errorMessage;

    IdentityExceptions(String errorName,
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