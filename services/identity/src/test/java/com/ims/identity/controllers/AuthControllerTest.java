package com.ims.identity.controllers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ims.identity.dto.LoginRequest;
import com.ims.identity.dto.LoginResponse;
import com.ims.identity.dto.LogoutRequest;
import com.ims.identity.dto.RefreshTokenRequest;
import com.ims.identity.dto.RefreshTokenResponse;
import com.ims.identity.services.AuthenticationService;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@MockitoBean
	private AuthenticationService authenticationService;

	@Test
	void login_ShouldReturn200() throws Exception {

		LoginRequest request = new LoginRequest(
				"admin@test.com",
				"password");

		LoginResponse response = new LoginResponse(
				"access-token",
				"refresh-token",
				"Bearer");

		when(authenticationService.login(any()))
				.thenReturn(response);

		mockMvc.perform(post("/api/v1/auth/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isOk());
	}

	@Test
	void refresh_ShouldReturn200() throws Exception {

		RefreshTokenRequest request = new RefreshTokenRequest(
				"refresh-token");

		RefreshTokenResponse response = new RefreshTokenResponse(
				"new-access-token",
				"refresh-token");

		when(authenticationService.refresh(any()))
				.thenReturn(response);

		mockMvc.perform(post("/api/v1/auth/refresh")
				.with(csrf())
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isOk());
	}

	@Test
	void logout_ShouldReturn204() throws Exception {

		LogoutRequest request = new LogoutRequest("refresh-token");

		doNothing().when(authenticationService)
				.logout(any());

		mockMvc.perform(post("/api/v1/auth/logout")
				.with(csrf())
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isNoContent());
	}
}
