package com.ims.identity.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ims.identity.dto.LoginRequestDto;
import com.ims.identity.dto.LoginResponseDto;
import com.ims.identity.dto.LogoutRequestDto;
import com.ims.identity.dto.RefreshTokenRequest;
import com.ims.identity.dto.RefreshTokenResponse;
import com.ims.identity.services.AuthenticationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;

    @Operation(summary = "Authenticate user")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Login successful"),
            @ApiResponse(responseCode = "401", description = "Invalid credentials")
    })
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto request) {
        return ResponseEntity.ok(authenticationService.login(request));
    }

    @Operation(summary = "Refresh access token")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Token refreshed"),
            @ApiResponse(responseCode = "401", description = "Invalid refresh token")
    })
    @PostMapping("/refresh")
    public ResponseEntity<RefreshTokenResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {

        return ResponseEntity.ok(authenticationService.refresh(request));
    }

    @Operation(summary = "Logout user")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Logged out successfully")
    })
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody LogoutRequestDto request) {

        authenticationService.logout(request);

        return ResponseEntity.noContent().build();
    }
}
