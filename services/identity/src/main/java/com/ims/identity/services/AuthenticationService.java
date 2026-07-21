package com.ims.identity.services;

import java.time.Duration;
import java.time.LocalDateTime;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import com.ims.identity.dto.LoginRequest;
import com.ims.identity.dto.LoginResponse;
import com.ims.identity.dto.RefreshTokenRequest;
import com.ims.identity.dto.RefreshTokenResponse;
import com.ims.identity.entities.RefreshToken;
import com.ims.identity.entities.User;
import com.ims.identity.properties.JwtProperties;
import com.ims.identity.repository.RefreshTokenRepository;
import com.ims.identity.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

	private final AuthenticationManager authenticationManager;
	private final UserRepository userRepository;
	private final RefreshTokenRepository refreshTokenRepository;
	private final JwtService jwtService;
	private final JwtProperties jwtProperties;

	public LoginResponse login(LoginRequest request) {

		authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(
						request.email(),
						request.password()));

		User user = userRepository.findByEmail(request.email())
				.orElseThrow();

		String accessToken = jwtService.generateAccessToken(user);
		String refreshTokenValue = jwtService.generateRefreshToken();

		RefreshToken refreshToken = new RefreshToken();
		refreshToken.setToken(refreshTokenValue);
		refreshToken.setUser(user);
		refreshToken.setRevoked(false);
		refreshToken.setExpiresAt(
				LocalDateTime.now()
						.plus(Duration.ofMillis(jwtProperties.getRefreshTokenExpiration())));

		refreshTokenRepository.save(refreshToken);

		return new LoginResponse(
				accessToken,
				refreshTokenValue,
				"Bearer");
	}

	public RefreshTokenResponse refresh(RefreshTokenRequest request) {
		RefreshToken refreshToken = refreshTokenRepository
				.findByToken(request.refreshToken())
				.orElseThrow(() -> new RuntimeException("Invalid refresh token"));
		if (refreshToken.isRevoked()) {
			throw new RuntimeException("Refresh token revoked");
		}
		if (refreshToken.getExpiresAt().isBefore(LocalDateTime.now())) {
			throw new RuntimeException("Refresh token expired");
		}
		String accessToken = jwtService.generateAccessToken(refreshToken.getUser());
		return new RefreshTokenResponse(
				accessToken,
				request.refreshToken());
	}

	public void logout(RefreshTokenRequest request) {
		throw new UnsupportedOperationException("Not implemented yet");
	}
}
