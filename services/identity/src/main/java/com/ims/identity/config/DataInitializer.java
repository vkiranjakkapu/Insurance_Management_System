package com.ims.identity.config;

import java.time.LocalDateTime;
import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.ims.identity.entities.Address;
import com.ims.identity.entities.Role;
import com.ims.identity.entities.RoleType;
import com.ims.identity.entities.User;
import com.ims.identity.repository.RoleRepository;
import com.ims.identity.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

	private final RoleRepository roleRepository;
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	@Override
	public void run(String... args) {

		Role adminRole = roleRepository.findByName(RoleType.ADMIN)
				.orElseGet(() -> roleRepository.save(
						new Role(null, RoleType.ADMIN, "Administrator")));

		roleRepository.findByName(RoleType.AGENT)
				.orElseGet(() -> roleRepository.save(
						new Role(null, RoleType.AGENT, "Insurance Agent")));

		roleRepository.findByName(RoleType.CUSTOMER)
				.orElseGet(() -> roleRepository.save(
						new Role(null, RoleType.CUSTOMER, "Customer")));

		if (userRepository.findByEmail("admin@ims.com").isEmpty()) {

			Address address = Address.builder()
					.id(null)
					.pinCode("534237")
					.street("street-1")
					.state("AP")
					.country("India")
					.build();
			User admin = User.builder()
					.firstName("System")
					.lastName("Admin")
					.email("admin@ims.com")
					.password(passwordEncoder.encode("admin123"))
					.address(address)
					.enabled(true)
					.createdAt(LocalDateTime.now())
					.updatedAt(LocalDateTime.now())
					.roles(Set.of(adminRole)).build();

			userRepository.save(admin);
		}
	}

}