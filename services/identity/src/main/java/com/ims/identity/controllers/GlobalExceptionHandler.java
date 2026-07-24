package com.ims.identity.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.ims.identity.exceptions.EmailAlreadyUsedException;
import com.ims.identity.exceptions.ForbiddenException;
import com.ims.identity.exceptions.IdentityExceptions;
import com.ims.identity.exceptions.InvalidRefreshTokenException;
import com.ims.identity.exceptions.ResourceNotFoundException;
import com.ims.platform.web.exception.SecurityExceptions;
import com.ims.platform.web.model.ErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidRefreshTokenException.class)
    public ResponseEntity<ErrorResponse> handle(InvalidRefreshTokenException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse(SecurityExceptions.INVALID_TOKEN, e.getMessage()));
    }

    @ExceptionHandler({BadCredentialsException.class})
    public ResponseEntity<ErrorResponse> handleUserNotFoundException(RuntimeException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse(IdentityExceptions.BAD_CREDENTIALS));
    }

    @ExceptionHandler(EmailAlreadyUsedException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateResourceException(EmailAlreadyUsedException e) {
        return ResponseEntity.status(HttpStatus.IM_USED)
                .body(new ErrorResponse(IdentityExceptions.DUPLICATE_RESOURCE_FOUND, e.getMessage()));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NON_AUTHORITATIVE_INFORMATION)
                .body(new ErrorResponse(IdentityExceptions.RESOURCE_NOT_FOUND, e.getMessage()));
    }

    @ExceptionHandler({ ForbiddenException.class, AccessDeniedException.class })
    public ResponseEntity<ErrorResponse> handleForbiddenException(Exception e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new ErrorResponse(SecurityExceptions.FORBIDDEN_ACCESS, e.getMessage()));
    }

}
