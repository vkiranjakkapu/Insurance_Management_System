package com.ims.identity.services.imp;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ims.identity.dto.CreateUserRequestDto;
import com.ims.identity.dto.PasswordChangeRequestDto;
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
import com.ims.identity.services.UserService;
import com.ims.platform.security.context.AuthenticationContext;
import com.ims.platform.security.model.AuthenticatedUser;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;
	private final RoleRepository roleRepository;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationContext authenticationContext;

	private ObjectMapper mapper = new ObjectMapper();

	@Override
	public UserResponse createUser(CreateUserRequestDto request) {

		AuthenticatedUser currentUser = authenticationContext.getCurrentUser().orElse(null);
		validatePermission(currentUser);

		if (userRepository.existsByEmail(request.email())) {
			throw new EmailAlreadyUsedException("Email already exists");
		}

		Role role = roleRepository.findByName(request.role())
				.orElseThrow(() -> new ResourceNotFoundException("Role not found"));

		User user = User.builder()
				.firstName(request.firstName())
				.lastName(request.lastName())
				.email(request.email())
				.password(passwordEncoder.encode(Optional.ofNullable(request.password()).orElse("password")))
				.dob(request.dob())
				.phone(request.phone())
				.gender(request.gender())
				.address(Address.builder()
						.street(request.address().street())
						.pinCode(request.address().pinCode())
						.state(request.address().state())
						.country(request.address().country())
						.build())
				.enabled(true)
				.roles(Set.of(role))
				.build();

		User saved = userRepository.save(user);

		return mapToResponse(saved, true);
	}

	private void validatePermission(AuthenticatedUser user) {
		if (user.getAuthorities().size() == 1
				&& user.getAuthorities().stream().toList().getFirst().equalsIgnoreCase("ROLE_CUSTOMER"))
			throw new ForbiddenException("You are not allowed to create this user.");
	}

	@Override
	@Transactional(readOnly = true)
	public List<UserResponse> getAllUsers() {

		return userRepository.findAllByDeletedFalse()
				.stream()
				.map(this::mapToResponse)
				.toList();
	}

	@Override
	public List<UserResponse> getAllUsersByRole(RoleType type) {
		Role role = roleRepository.findByName(type)
				.orElseThrow(() -> new ResourceNotFoundException("Role not found: " + type));
		// 2. Pass the managed entity to your repository method
		// List<User> users =
		// userRepository.findAllByRolesAndDeletedFalse(Set.of(role));
		// Set<Role> roles = Set.of(Role.builder().name(role).build());
		return userRepository.findAllByRolesAndDeletedFalse(Set.of(role)).stream().map(this::mapToResponse).toList();
	}

	@Override
	@Transactional(readOnly = true)
	public List<UserResponse> getAllUsersWithIds(Collection<UUID> ids) {

		return userRepository.findByIdIn(ids)
				.stream()
				.map(this::mapToResponse)
				.toList();
	}

	@Override
	@Transactional(readOnly = true)
	public UserResponse getUserById(UUID id) {

		User user = userRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		return mapToResponse(user);
	}

	@Override
	@Transactional(readOnly = true)
	public UserResponse getUserByEmail(String email) {

		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		return mapToResponse(user);
	}

	@Override
	public UserResponse updateUser(UUID id, UpdateUserRequest request) {

		User user = userRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		user.setFirstName(request.firstName());
		user.setLastName(request.lastName());
		user.setPhone(request.phone());
		Address address = mapper.convertValue(request.address(), Address.class);
		address.setId(user.getAddress().getId());
		address.setDeleted(false);
		user.setAddress(address);
		user.setDob(user.getDob());
		user.setEnabled(request.enabled());

		return mapToResponse(userRepository.save(user));
	}

	@Override
	public UserResponse changePassword(PasswordChangeRequestDto request) {

		AuthenticatedUser currentUser = authenticationContext.getCurrentUser().orElse(null);

		User user = userRepository.findById(UUID.fromString(currentUser.getUserId()))
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		if (!passwordEncoder.matches(request.oldPassword(), user.getPassword()))
			throw new ForbiddenException("Incorrect old password.");

		user.setPassword(passwordEncoder.encode(request.newPassword()));

		return mapToResponse(userRepository.save(user));
	}

	@Override
	@Transactional
	public void deleteUser(UUID id) {

		User user = userRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		user.setDeleted(true);

		if (user.getAddress() != null) {
			user.getAddress().setDeleted(true);
		}

		userRepository.save(user);
	}

	private UserResponse mapToResponse(User user) {

		return UserResponse.builder()
				.id(user.getId())
				.firstName(user.getFirstName())
				.lastName(user.getLastName())
				.email(user.getEmail())
				.phone(user.getPhone())
				.gender(user.getGender())
				.address(user.getAddress())
				.dob(user.getDob())
				.enabled(user.isEnabled())
				.roles(
						user.getRoles().stream()
								.map(role -> role.getName())
								.collect(Collectors.toSet()))
				.createdAt(user.getCreatedAt())
				.updatedAt(user.getUpdatedAt())
				.build();
	}

	private UserResponse mapToResponse(User user, boolean ignoreTimeStamps) {

		return UserResponse.builder()
				.id(user.getId())
				.firstName(user.getFirstName())
				.lastName(user.getLastName())
				.email(user.getEmail())
				.phone(user.getPhone())
				.gender(user.getGender())
				.address(user.getAddress())
				.dob(user.getDob())
				.enabled(user.isEnabled())
				.roles(
						user.getRoles().stream()
								.map(role -> role.getName())
								.collect(Collectors.toSet()))
				.build();
	}
}