package com.ims.identity.controllers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.JwtRequestPostProcessor;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ims.identity.dto.AddressDto;
import com.ims.identity.dto.CreateUserRequestDto;
import com.ims.identity.dto.FetchUsersRequestDto;
import com.ims.identity.dto.UpdateUserRequest;
import com.ims.identity.dto.UserResponse;
import com.ims.identity.entities.RoleType;
import com.ims.identity.services.UserService;
import com.ims.platform.security.context.AuthenticationContext;
import com.ims.platform.security.model.AuthenticatedUser;
import com.ims.platform.security.model.DefaultAuthenticatedUser;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
class UserControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@MockitoBean
	private UserService userService;

	@MockitoBean
	private AuthenticationContext authenticationContext;

	@BeforeEach
	void setup() {

		AuthenticatedUser authenticatedUser = new DefaultAuthenticatedUser(
				UUID.fromString("c0186249-9fc1-4927-97b3-a08a21febfe3").toString(),
				"john@test.com",
				"admin",
				List.of("ROLE_ADMIN"));

		when(authenticationContext.getCurrentUser())
				.thenReturn(Optional.of(authenticatedUser));
	}

	@Test
	void me_ShouldReturn200() throws Exception {

		UUID id = UUID.fromString("c0186249-9fc1-4927-97b3-a08a21febfe3");

		when(userService.getUserById(id))
				.thenReturn(response());

		mockMvc.perform(get("/api/v1/users/me")
				.with(adminJwt()))
				.andExpect(status().isOk());
	}

	@Test
	void createUser_ShouldReturn201() throws Exception {

		when(userService.createUser(any()))
				.thenReturn(response());

		mockMvc.perform(post("/api/v1/users/")
				.with(adminJwt())
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(createRequest())))
				.andExpect(status().isCreated());
	}

	@Test
	void getAllUsers_ShouldReturn200() throws Exception {

		when(userService.getAllUsers())
				.thenReturn(List.of(response()));

		mockMvc.perform(get("/api/v1/users/")
				.with(adminJwt()))
				.andExpect(status().isOk());
	}

	@Test
	void getUserById_ShouldReturn200() throws Exception {

		when(userService.getUserById(UUID.fromString("c0186249-9fc1-4927-97b3-a08a21febfe3")))
				.thenReturn(response());

		mockMvc.perform(get("/api/v1/users/" + UUID.fromString("c0186249-9fc1-4927-97b3-a08a21febfe3"))
				.with(adminJwt()))
				.andExpect(status().isOk());
	}

	@Test
	void updateUser_ShouldReturn200() throws Exception {

		when(userService.updateUser(eq(UUID.fromString("c0186249-9fc1-4927-97b3-a08a21febfe3")), any()))
				.thenReturn(response());

		mockMvc.perform(put("/api/v1/users/" + UUID.fromString("c0186249-9fc1-4927-97b3-a08a21febfe3"))
				.with(adminJwt())
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(updateRequest())))
				.andExpect(status().isOk());
	}

	@Test
	void deleteUser_ShouldReturn204() throws Exception {

		doNothing().when(userService).deleteUser(UUID.fromString("c0186249-9fc1-4927-97b3-a08a21febfe3"));

		mockMvc.perform(delete("/api/v1/users/" + UUID.fromString("c0186249-9fc1-4927-97b3-a08a21febfe3"))
				.with(adminJwt()))
				.andExpect(status().isNoContent());
	}

	@Test
	void createUser_InvalidRequest_ShouldReturn400() throws Exception {

		CreateUserRequestDto request = new CreateUserRequestDto(
				"",
				"",
				"invalid-email",
				"",
				null,
				"",
				null,
				null);

		mockMvc.perform(post("/api/v1/users/")
				.with(adminJwt())
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void getAllUsersWithIds_ShouldReturn200() throws Exception {

		UUID id = UUID.fromString("c0186249-9fc1-4927-97b3-a08a21febfe3");

		FetchUsersRequestDto request = new FetchUsersRequestDto(List.of(id));

		when(userService.getAllUsersWithIds(List.of(id)))
				.thenReturn(List.of(response()));

		mockMvc.perform(post("/api/v1/users/search")
				.with(adminJwt())
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isOk());
	}

	@Test
	void updateUser_InvalidRequest_ShouldReturn400() throws Exception {

		UpdateUserRequest request = new UpdateUserRequest(
				"",
				"",
				"",
				null,
				null,
				true);

		mockMvc.perform(put("/api/v1/users/" +
				UUID.fromString("c0186249-1111-4927-97b3-a08a21febfe3"))
				.with(adminJwt())
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isBadRequest());
	}

	private CreateUserRequestDto createRequest() {

		return new CreateUserRequestDto(
				"john@test.com",
				"John",
				"Doe",
				"password",
				LocalDate.of(2000, 1, 1),
				"9999999999",
				new AddressDto(
						"Street",
						"534237",
						"AP",
						"India"),
				RoleType.CUSTOMER);
	}

	private UpdateUserRequest updateRequest() {

		return new UpdateUserRequest(
				"John",
				"Doe",
				"8888888888",
				AddressDto.builder()
						.street("New Street")
						.pinCode("534237")
						.state("AP")
						.country("India")
						.build(),
				LocalDate.of(2000, 1, 1),
				true);
	}

	private UserResponse response() {

		return new UserResponse(
				UUID.fromString("c0186249-9fc1-4927-97b3-a08a21febfe3"),
				"John",
				"Doe",
				"john@test.com",
				"9999999999",
				null,
				LocalDate.of(2000, 1, 1),
				true,
				Set.of(RoleType.CUSTOMER),
				LocalDateTime.now(),
				LocalDateTime.now());
	}

	private JwtRequestPostProcessor adminJwt() {

		return jwt()
				.jwt(jwt -> jwt
						.subject(UUID.fromString("c0186249-9fc1-4927-97b3-a08a21febfe3").toString())
						.claim("username", "admin")
						.claim("email", "admin@email.com"))
				.authorities(new SimpleGrantedAuthority("ROLE_ADMIN"));
	}
}