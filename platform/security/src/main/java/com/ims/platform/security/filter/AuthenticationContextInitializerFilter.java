package com.ims.platform.security.filter;

import java.io.IOException;

import org.springframework.web.filter.OncePerRequestFilter;

import com.ims.platform.logging.constants.LoggingConstants;
import com.ims.platform.logging.holder.RequestContextHolder;

import com.ims.platform.security.context.AuthenticationContext;
import com.ims.platform.security.model.AuthenticatedUser;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public final class AuthenticationContextInitializerFilter
		extends OncePerRequestFilter {

	private final AuthenticationContext authenticationContext;

	private final RequestContextHolder requestContextHolder;

	public AuthenticationContextInitializerFilter(
			AuthenticationContext authenticationContext,
			RequestContextHolder requestContextHolder) {

		this.authenticationContext = authenticationContext;
		this.requestContextHolder = requestContextHolder;
	}

	@Override
	protected void doFilterInternal(
			HttpServletRequest request,
			HttpServletResponse response,
			FilterChain filterChain)
			throws ServletException, IOException {

		authenticationContext
				.getCurrentUser()
				.ifPresent(this::populateRequestContext);

		filterChain.doFilter(request, response);
	}

	private void populateRequestContext(
			AuthenticatedUser user) {

		requestContextHolder.put(
				LoggingConstants.USER_ID,
				user.getUserId());

		requestContextHolder.put(
				LoggingConstants.USERNAME,
				user.getUsername());
	}
}