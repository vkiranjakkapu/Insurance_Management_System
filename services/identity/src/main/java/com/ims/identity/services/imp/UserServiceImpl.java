package com.ims.identity.services.imp;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ims.identity.dto.CreateUserRequest;
import com.ims.identity.dto.UpdateUserRequest;
import com.ims.identity.dto.UserResponse;
import com.ims.identity.entities.Role;
import com.ims.identity.entities.RoleType;
import com.ims.identity.entities.User;
import com.ims.identity.exceptions.EmailAlreadyUsedException;
import com.ims.identity.exceptions.ForbiddenException;
import com.ims.identity.exceptions.ResourceNotFoundException;
import com.ims.identity.repository.RoleRepository;
import com.ims.identity.repository.UserRepository;
import com.ims.identity.services.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse createUser(CreateUserRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyUsedException("Email already exists");
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User creator = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ForbiddenException("Authenticated user not found"));

        validatePermission(creator, request.role());

        Role role = roleRepository.findByName(request.role())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        User user = User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .dob(request.dob())
                .phone(request.phone())
                .address(request.address())
                .enabled(true)
                .roles(Set.of(role))
                .build();

        User saved = userRepository.save(user);

        return mapToResponse(saved);
    }

    private void validatePermission(User creator, RoleType requestedRole) {

        boolean admin = creator.getRoles().stream()
                .anyMatch(r -> r.getName() == RoleType.ADMIN);

        boolean agent = creator.getRoles().stream()
                .anyMatch(r -> r.getName() == RoleType.AGENT);

        if (admin) {
            return;
        }

        if (agent && requestedRole == RoleType.CUSTOMER) {
            return;
        }

        throw new AccessDeniedException("You are not allowed to create this user.");
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return mapToResponse(user);
    }

    @Override
    public UserResponse updateUser(Long id, UpdateUserRequest request) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setPhone(request.phone());
        user.setAddress(request.address());
        user.setDob(request.dob());
        user.setEnabled(request.enabled());

        return mapToResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {

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
}
