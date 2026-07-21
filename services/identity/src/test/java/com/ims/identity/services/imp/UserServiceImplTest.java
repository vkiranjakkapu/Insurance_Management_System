package com.ims.identity.services.imp;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.ims.identity.dto.CreateUserRequest;
import com.ims.identity.dto.UpdateUserRequest;
import com.ims.identity.dto.UserResponse;
import com.ims.identity.entities.Address;
import com.ims.identity.entities.Role;
import com.ims.identity.entities.RoleType;
import com.ims.identity.entities.User;
import com.ims.identity.exceptions.EmailAlreadyUsedException;
import com.ims.identity.exceptions.ForbiddenException;
import com.ims.identity.exceptions.ResourceNotFoundException;
import com.ims.identity.repository.RoleRepository;
import com.ims.identity.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

	@Mock
	private UserRepository userRepository;

	@Mock
	private RoleRepository roleRepository;

	@Mock
	private PasswordEncoder passwordEncoder;

	@InjectMocks
	private UserServiceImpl userService;

	private User admin;

	private Role adminRole;

	private Address address;

	@BeforeEach
	void setup() {

		adminRole = new Role();
		adminRole.setId(1L);
		adminRole.setName(RoleType.ADMIN);

		address = Address.builder()
				.street("MG Road")
				.state("Karnataka")
				.country("India")
				.pinCode("560001")
				.build();

		admin = User.builder()
				.id(1L)
				.firstName("Admin")
				.lastName("User")
				.email("admin@test.com")
				.password("password")
				.enabled(true)
				.roles(Set.of(adminRole))
				.build();

		SecurityContextHolder.getContext()
				.setAuthentication(
						new TestingAuthenticationToken(
								"admin@test.com",
								null));
	}

	@AfterEach
	void cleanup() {
		SecurityContextHolder.clearContext();
	}

	@Test
	void createUser_ShouldCreateSuccessfully() {

		CreateUserRequest request = new CreateUserRequest(
				"John",
				"Doe",
				"john@test.com",
				"password",
				LocalDate.of(2000, 1, 1),
				"9999999999",
				address,
				RoleType.CUSTOMER);

		Role customerRole = new Role();
		customerRole.setName(RoleType.CUSTOMER);

		when(userRepository.existsByEmail(request.email()))
				.thenReturn(false);

		when(userRepository.findByEmail("admin@test.com"))
				.thenReturn(Optional.of(admin));

		when(roleRepository.findByName(RoleType.CUSTOMER))
				.thenReturn(Optional.of(customerRole));

		when(passwordEncoder.encode(any()))
				.thenReturn("encoded-password");

		when(userRepository.save(any(User.class)))
				.thenAnswer(invocation -> invocation.getArgument(0));

		UserResponse response = userService.createUser(request);

		assertNotNull(response);
		assertEquals("John", response.firstName());
		assertEquals("Doe", response.lastName());
		assertEquals("john@test.com", response.email());

		verify(userRepository).save(any(User.class));
	}

	@Test
	void createUser_ShouldThrow_WhenEmailAlreadyExists() {

		CreateUserRequest request = new CreateUserRequest(
				"John",
				"Doe",
				"john@test.com",
				"password",
				LocalDate.now(),
				"9999999999",
				address,
				RoleType.CUSTOMER);

		when(userRepository.existsByEmail(request.email()))
				.thenReturn(true);

		assertThrows(
				EmailAlreadyUsedException.class,
				() -> userService.createUser(request));

		verify(userRepository, never()).save(any());
	}

	@Test
	void createUser_ShouldAllowAgentToCreateCustomer() {

		Role agentRole = new Role();
		agentRole.setName(RoleType.AGENT);

		User agent = User.builder()
				.email("agent@test.com")
				.roles(Set.of(agentRole))
				.build();

		SecurityContextHolder.getContext().setAuthentication(
				new TestingAuthenticationToken("agent@test.com", null));

		CreateUserRequest request = new CreateUserRequest(
				"Customer",
				"One",
				"customer@test.com",
				"password",
				LocalDate.now(),
				"9999999999",
				address,
				RoleType.CUSTOMER);

		Role customerRole = new Role();
		customerRole.setName(RoleType.CUSTOMER);

		when(userRepository.existsByEmail(any()))
				.thenReturn(false);

		when(userRepository.findByEmail("agent@test.com"))
				.thenReturn(Optional.of(agent));

		when(roleRepository.findByName(RoleType.CUSTOMER))
				.thenReturn(Optional.of(customerRole));

		when(passwordEncoder.encode(any()))
				.thenReturn("encoded");

		when(userRepository.save(any(User.class)))
				.thenAnswer(i -> i.getArgument(0));

		UserResponse response = userService.createUser(request);

		assertNotNull(response);

		verify(userRepository).save(any(User.class));
	}

	@Test
	void createUser_ShouldThrow_WhenAgentCreatesAdmin() {

		Role agentRole = new Role();
		agentRole.setName(RoleType.AGENT);

		User agent = User.builder()
				.email("agent@test.com")
				.roles(Set.of(agentRole))
				.build();

		SecurityContextHolder.getContext().setAuthentication(
				new TestingAuthenticationToken("agent@test.com", null));

		CreateUserRequest request = new CreateUserRequest(
				"Admin",
				"User",
				"newadmin@test.com",
				"password",
				LocalDate.now(),
				"9999999999",
				address,
				RoleType.ADMIN);

		when(userRepository.existsByEmail(any()))
				.thenReturn(false);

		when(userRepository.findByEmail("agent@test.com"))
				.thenReturn(Optional.of(agent));

		assertThrows(
				ForbiddenException.class,
				() -> userService.createUser(request));

		verify(userRepository, never()).save(any());
	}

	@Test
	void getAllUsers_ShouldReturnUsers() {

		when(userRepository.findAll())
				.thenReturn(List.of(admin));

		List<UserResponse> users = userService.getAllUsers();

		assertEquals(1, users.size());
		assertEquals("admin@test.com", users.get(0).email());

		verify(userRepository).findAll();
	}

	@Test
	void getUserById_ShouldReturnUser() {

		when(userRepository.findById(1L))
				.thenReturn(Optional.of(admin));

		UserResponse response = userService.getUserById(1L);

		assertEquals(1L, response.id());
		assertEquals("admin@test.com", response.email());

		verify(userRepository).findById(1L);
	}

	@Test
	void getUserById_ShouldThrow_WhenUserNotFound() {

		when(userRepository.findById(anyLong()))
				.thenReturn(Optional.empty());

		assertThrows(
				ResourceNotFoundException.class,
				() -> userService.getUserById(100L));
	}

	@Test
	void updateUser_ShouldUpdateSuccessfully() {

		UpdateUserRequest request = new UpdateUserRequest(
				"Updated",
				"User",
				"8888888888",
				address,
				LocalDate.of(1998, 1, 1),
				true);

		when(userRepository.findById(1L))
				.thenReturn(Optional.of(admin));

		when(userRepository.save(any(User.class)))
				.thenAnswer(i -> i.getArgument(0));

		UserResponse response = userService.updateUser(1L, request);

		assertEquals("Updated", response.firstName());
		assertEquals("User", response.lastName());
		assertEquals("8888888888", response.phone());

		verify(userRepository).save(admin);
	}

	@Test
	void updateUser_ShouldThrow_WhenUserNotFound() {

		UpdateUserRequest request = new UpdateUserRequest(
				"Updated",
				"User",
				"9999999999",
				address,
				LocalDate.now(),
				true);

		when(userRepository.findById(anyLong()))
				.thenReturn(Optional.empty());

		assertThrows(
				ResourceNotFoundException.class,
				() -> userService.updateUser(1L, request));
	}

	@Test
	void deleteUser_ShouldSoftDeleteUser() {

		admin.setAddress(address);

		when(userRepository.findById(1L))
				.thenReturn(Optional.of(admin));

		userService.deleteUser(1L);

		assertTrue(admin.isDeleted());
		assertTrue(admin.getAddress().isDeleted());

		verify(userRepository).save(admin);
	}

	@Test
	void deleteUser_ShouldSoftDeleteUser_WhenAddressIsNull() {

		admin.setAddress(null);

		when(userRepository.findById(1L))
				.thenReturn(Optional.of(admin));

		userService.deleteUser(1L);

		assertTrue(admin.isDeleted());

		verify(userRepository).save(admin);
	}

	@Test
	void deleteUser_ShouldThrow_WhenUserNotFound() {

		when(userRepository.findById(anyLong()))
				.thenReturn(Optional.empty());

		assertThrows(
				ResourceNotFoundException.class,
				() -> userService.deleteUser(1L));

		verify(userRepository, never()).save(any());
	}

}