package com.ims.identity;

import java.time.LocalDateTime;
import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.ims.identity.entities.Role;
import com.ims.identity.entities.RoleType;
import com.ims.identity.entities.User;
import com.ims.identity.repository.RoleRepository;
import com.ims.identity.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@SpringBootApplication
@RequiredArgsConstructor
public class IdentityserviceApplication implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

	public static void main(String[] args) {
		SpringApplication.run(IdentityserviceApplication.class, args);
	}

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

            User admin = new User();
            admin.setFirstName("System");
            admin.setLastName("Admin");
            admin.setEmail("admin@ims.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEnabled(true);
            admin.setCreatedAt(LocalDateTime.now());
            admin.setUpdatedAt(LocalDateTime.now());
            admin.setRoles(Set.of(adminRole));

            userRepository.save(admin);
        }
    }

}
