package com.ims.identity.services.imp;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ims.identity.dto.AddressDto;
import com.ims.identity.dto.CreateUserRequestDto;
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
import com.ims.platform.security.context.AuthenticationContext;
import com.ims.platform.security.model.AuthenticatedUser;
import com.ims.platform.security.model.DefaultAuthenticatedUser;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

	@Mock
	private UserRepository userRepository;

	@Mock
	private RoleRepository roleRepository;

	@Mock
	private PasswordEncoder passwordEncoder;

	@Mock
	private AuthenticationContext authenticationContext;

	@InjectMocks
	private UserServiceImpl userService;

	private User admin;
	private Role adminRole;
	private AddressDto addressDto;
	private Address address;
	private UUID USER_ID;

	private final ObjectMapper mapper = new ObjectMapper();

	@BeforeEach
	void setup() {

		USER_ID = UUID.fromString("c0186249-9fc1-4927-97b3-a08a21febfe3");

		adminRole = new Role();
		adminRole.setId(1L);
		adminRole.setName(RoleType.ADMIN);

		addressDto = AddressDto.builder()
				.street("MG Road")
				.state("Karnataka")
				.country("India")
				.pinCode("560001")
				.build();

		address = mapper.convertValue(addressDto, Address.class);

		admin = User.builder()
				.id(USER_ID)
				.firstName("Admin")
				.lastName("User")
				.email("admin@test.com")
				.password("password")
				.enabled(true)
				.roles(Set.of(adminRole))
				.build();
	}

	private AuthenticatedUser authenticatedUser(String... authorities) {

		return new DefaultAuthenticatedUser(
				USER_ID.toString(),
				"admin@test.com",
				"admin",
				List.of(authorities));
	}

	@Test
	void createUser_ShouldCreateSuccessfully() {

		CreateUserRequestDto request = new CreateUserRequestDto(
				"john@test.com",
				"John",
				"Doe",
				"password",
				LocalDate.of(2000, 1, 1),
				"9999999999",
				addressDto,
				RoleType.CUSTOMER);

		Role customerRole = new Role();
		customerRole.setName(RoleType.CUSTOMER);

		when(authenticationContext.getCurrentUser())
				.thenReturn(Optional.of(authenticatedUser("ROLE_ADMIN")));

		when(userRepository.existsByEmail(request.email()))
				.thenReturn(false);

		when(roleRepository.findByName(RoleType.CUSTOMER))
				.thenReturn(Optional.of(customerRole));

		when(passwordEncoder.encode(any()))
				.thenReturn("encoded-password");

		when(userRepository.save(any(User.class)))
				.thenAnswer(i -> i.getArgument(0));

		UserResponse response = userService.createUser(request);

		assertNotNull(response);
		assertEquals("John", response.firstName());
		assertEquals("Doe", response.lastName());
		assertEquals("john@test.com", response.email());

		verify(userRepository).save(any(User.class));
	}

	@Test
	void createUser_ShouldThrow_WhenEmailAlreadyExists() {

		CreateUserRequestDto request = new CreateUserRequestDto(
				"John",
				"Doe",
				"john@test.com",
				"password",
				LocalDate.now(),
				"9999999999",
				addressDto,
				RoleType.CUSTOMER);

		when(authenticationContext.getCurrentUser())
				.thenReturn(Optional.of(authenticatedUser("ROLE_ADMIN")));

		when(userRepository.existsByEmail(request.email()))
				.thenReturn(true);

		assertThrows(
				EmailAlreadyUsedException.class,
				() -> userService.createUser(request));

		verify(userRepository, never()).save(any());
	}

	@Test
	void createUser_ShouldAllowAgentToCreateUser() {

		CreateUserRequestDto request = new CreateUserRequestDto(
				"Customer",
				"One",
				"customer@test.com",
				"password",
				LocalDate.now(),
				"9999999999",
				addressDto,
				RoleType.CUSTOMER);

		Role customerRole = new Role();
		customerRole.setName(RoleType.CUSTOMER);

		when(authenticationContext.getCurrentUser())
				.thenReturn(Optional.of(authenticatedUser("ROLE_AGENT")));

		when(userRepository.existsByEmail(any()))
				.thenReturn(false);

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
	void createUser_ShouldThrow_WhenCurrentUserIsCustomer() {

		CreateUserRequestDto request = new CreateUserRequestDto(
				"John",
				"Doe",
				"john@test.com",
				"password",
				LocalDate.now(),
				"9999999999",
				addressDto,
				RoleType.CUSTOMER);

		when(authenticationContext.getCurrentUser())
				.thenReturn(Optional.of(authenticatedUser("ROLE_CUSTOMER")));

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
		assertEquals("admin@test.com", users.getFirst().email());

		verify(userRepository).findAll();
	}

	@Test
	void getAllUsersWithIds_ShouldReturnUsers() {

		when(userRepository.findByIdIn(List.of(USER_ID)))
				.thenReturn(List.of(admin));

		List<UserResponse> users = userService.getAllUsersWithIds(List.of(USER_ID));

		assertEquals(1, users.size());
		assertEquals(USER_ID, users.getFirst().id());

		verify(userRepository).findByIdIn(List.of(USER_ID));
	}

	@Test
	void getUserById_ShouldReturnUser() {

		when(userRepository.findById(USER_ID))
				.thenReturn(Optional.of(admin));

		UserResponse response = userService.getUserById(USER_ID);

		assertEquals(USER_ID, response.id());
		assertEquals("admin@test.com", response.email());

		verify(userRepository).findById(USER_ID);
	}

	@Test
	void getUserById_ShouldThrow_WhenUserNotFound() {

		when(userRepository.findById(USER_ID))
				.thenReturn(Optional.empty());

		assertThrows(
				ResourceNotFoundException.class,
				() -> userService.getUserById(USER_ID));
	}

	@Test
	void getUserByEmail_ShouldReturnUser() {

		when(userRepository.findByEmail("admin@test.com"))
				.thenReturn(Optional.of(admin));

		UserResponse response = userService.getUserByEmail("admin@test.com");

		assertEquals("admin@test.com", response.email());

		verify(userRepository).findByEmail("admin@test.com");
	}

	@Test
	void getUserByEmail_ShouldThrow_WhenUserNotFound() {

		when(userRepository.findByEmail("admin@test.com"))
				.thenReturn(Optional.empty());

		assertThrows(
				ResourceNotFoundException.class,
				() -> userService.getUserByEmail("admin@test.com"));
	}

	@Test
	void updateUser_ShouldUpdateSuccessfully() {

		Address existingAddress = new Address();
		existingAddress.setId(1L);
		admin.setAddress(existingAddress);

		UpdateUserRequest request = new UpdateUserRequest(
				"Updated",
				"User",
				"8888888888",
				addressDto,
				LocalDate.of(1998, 1, 1),
				true);

		when(userRepository.findById(USER_ID))
				.thenReturn(Optional.of(admin));

		when(userRepository.save(any(User.class)))
				.thenAnswer(i -> i.getArgument(0));

		UserResponse response = userService.updateUser(USER_ID, request);

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
				addressDto,
				LocalDate.now(),
				true);

		when(userRepository.findById(USER_ID))
				.thenReturn(Optional.empty());

		assertThrows(
				ResourceNotFoundException.class,
				() -> userService.updateUser(USER_ID, request));
	}

	@Test
	void deleteUser_ShouldSoftDeleteUser() {

		admin.setAddress(address);

		when(userRepository.findById(USER_ID))
				.thenReturn(Optional.of(admin));

		userService.deleteUser(USER_ID);

		assertTrue(admin.isDeleted());
		assertTrue(admin.getAddress().isDeleted());

		verify(userRepository).save(admin);
	}

	@Test
	void deleteUser_ShouldSoftDeleteUser_WhenAddressIsNull() {

		admin.setAddress(null);

		when(userRepository.findById(USER_ID))
				.thenReturn(Optional.of(admin));

		userService.deleteUser(USER_ID);

		assertTrue(admin.isDeleted());

		verify(userRepository).save(admin);
	}

	@Test
	void deleteUser_ShouldThrow_WhenUserNotFound() {

		when(userRepository.findById(USER_ID))
				.thenReturn(Optional.empty());

		assertThrows(
				ResourceNotFoundException.class,
				() -> userService.deleteUser(USER_ID));

		verify(userRepository, never()).save(any());
	}
}