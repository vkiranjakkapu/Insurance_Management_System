package com.ims.premiums.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.ims.platform.web.exception.SecurityExceptions;
import com.ims.platform.web.model.ErrorResponse;
import com.ims.premiums.enums.IdentityExceptions;
import com.ims.premiums.exception.InternalCommunicationException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({ BadCredentialsException.class })
    public ResponseEntity<ErrorResponse> handleUserNotFoundException(RuntimeException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse(IdentityExceptions.BAD_CREDENTIALS));
    }

	@ExceptionHandler({ AuthorizationDeniedException.class })
	public ResponseEntity<ErrorResponse> handleForbiddenException(AuthorizationDeniedException e) {
		return ResponseEntity.status(HttpStatus.FORBIDDEN)
				.body(new ErrorResponse(SecurityExceptions.FORBIDDEN_ACCESS, e.getMessage()));
	}

	@ExceptionHandler({ InternalCommunicationException.class })
	public ResponseEntity<?> handleForbiddenException(InternalCommunicationException e) {
		return ResponseEntity
                .status(HttpStatus.NOT_FOUND) // Or keep HttpStatus.INTERNAL_SERVER_ERROR based on your requirements
                .contentType(MediaType.APPLICATION_JSON)
                .body(e.getMessage()); 
	}

}
