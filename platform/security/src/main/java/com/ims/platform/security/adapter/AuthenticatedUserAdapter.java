package com.ims.platform.security.adapter;

import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import com.ims.platform.security.model.AuthenticatedUser;
import com.ims.platform.security.model.DefaultAuthenticatedUser;
import com.ims.platform.security.properties.SecurityProperties;

public final class AuthenticatedUserAdapter
		implements AuthenticationAdapter {

	private SecurityProperties properties;

	public AuthenticatedUserAdapter(SecurityProperties properties) {
		this.properties = properties;
	}

	@Override
	public AuthenticatedUser adapt(Authentication authentication) {

		if (!(authentication instanceof JwtAuthenticationToken token)) {
			throw new IllegalArgumentException(
					"Unsupported authentication type: "
							+ authentication.getClass().getName());
		}

		Jwt jwt = token.getToken();

		return new DefaultAuthenticatedUser(
				jwt.getSubject(),
				jwt.getClaimAsString(properties.getJwt().getUsernameClaim()),
				token.getAuthorities()
						.stream()
						.map(authority -> authority.getAuthority())
						.collect(Collectors.toUnmodifiableList()));
	}
}