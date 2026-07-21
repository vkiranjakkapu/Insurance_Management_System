package com.ims.identity.controllers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ims.identity.dto.CreateUserRequest;
import com.ims.identity.dto.UpdateUserRequest;
import com.ims.identity.dto.UserResponse;
import com.ims.identity.entities.Address;
import com.ims.identity.entities.RoleType;
import com.ims.identity.services.UserService;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@MockitoBean
	private UserService userService;

	@Test
	void createUser_ShouldReturn201() throws Exception {

		when(userService.createUser(any()))
				.thenReturn(response());

		mockMvc.perform(post("/api/users")
				.with(user("admin").roles("ADMIN"))
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(createRequest())))
				.andExpect(status().isCreated());
	}

	@Test
	void getAllUsers_ShouldReturn200() throws Exception {

		when(userService.getAllUsers())
				.thenReturn(List.of(response()));

		mockMvc.perform(get("/api/users")
				.with(user("admin").roles("ADMIN")))
				.andExpect(status().isOk());
	}

	@Test
	void getUserById_ShouldReturn200() throws Exception {

		when(userService.getUserById(1L))
				.thenReturn(response());

		mockMvc.perform(get("/api/users/1")
				.with(user("admin").roles("ADMIN")))
				.andExpect(status().isOk());
	}

	@Test
	void updateUser_ShouldReturn200() throws Exception {

		when(userService.updateUser(eq(1L), any()))
				.thenReturn(response());

		mockMvc.perform(put("/api/users/1")
				.with(user("admin").roles("ADMIN"))
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(updateRequest())))
				.andExpect(status().isOk());
	}

	@Test
	void deleteUser_ShouldReturn204() throws Exception {

		doNothing().when(userService).deleteUser(1L);

		mockMvc.perform(delete("/api/users/1")
				.with(user("admin").roles("ADMIN")))
				.andExpect(status().isNoContent());
	}

	@Test
	void createUser_InvalidRequest_ShouldReturn400() throws Exception {
		CreateUserRequest request = new CreateUserRequest(
				"", // @NotBlank
				"", // @NotBlank
				"invalid-email", // @Email
				"", // @NotBlank
				null, // @NotNull
				"", // @NotBlank
				null, // @NotNull
				null);

		mockMvc.perform(post("/api/users")
				.with(user("admin").roles("ADMIN"))
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isBadRequest());
	}

	private CreateUserRequest createRequest() {

		return new CreateUserRequest(
				"John",
				"Doe",
				"john@test.com",
				"password",
				LocalDate.of(2000, 1, 1),
				"9999999999",
				new Address(
						null,
						"Street",
						"534237",
						"AP",
						"India",
						false),
				RoleType.CUSTOMER);
	}

	private UpdateUserRequest updateRequest() {

		return new UpdateUserRequest(
				"John",
				"Doe",
				"8888888888",
				new Address(
						null,
						"New Street",
						"534237",
						"AP",
						"India",
						false),
				LocalDate.of(2000, 1, 1),
				true);
	}

	private UserResponse response() {

		return new UserResponse(
				1L,
				"John",
				"Doe",
				"john@test.com",
				"9999999999",
				null, // Address
				LocalDate.of(2000, 1, 1),
				true,
				Set.of(RoleType.CUSTOMER),
				LocalDateTime.now(),
				LocalDateTime.now());
	}
}