package com.ims.identity.services.imp;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Set;
import java.time.Duration;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetails;

import com.ims.identity.entities.Role;
import com.ims.identity.entities.RoleType;
import com.ims.identity.entities.User;
import com.ims.platform.security.properties.SecurityProperties;

import io.jsonwebtoken.JwtException;

class JwtServiceImpTest {

    private JwtServiceImp jwtService;

    private SecurityProperties properties;

    private User user;

    @BeforeEach
    void setup() {

        properties = new SecurityProperties();

        properties.getJwt().setSecret(
                "ThisIsAVeryLongSecretKeyForJwtTestingPurposeOnly123456789");

        properties.getJwt().setAccessTokenExpiration(Duration.ofHours(1));

        properties.getJwt().setRefreshTokenExpiration(Duration.ofDays(1));

        jwtService = new JwtServiceImp(properties);

        Role role = new Role();
        role.setName(RoleType.ADMIN);

        user = User.builder()
                .email("admin@test.com")
                .roles(Set.of(role))
                .build();
    }

    @Test
    void generateAccessToken_ShouldReturnToken() {

        String token = jwtService.generateAccessToken(user);

        assertNotNull(token);
        assertFalse(token.isBlank());
    }

    @Test
    void extractEmail_ShouldReturnCorrectEmail() {

        String token = jwtService.generateAccessToken(user);

        String email = jwtService.extractEmail(token);

        assertEquals("admin@test.com", email);
    }

    @Test
    void generateRefreshToken_ShouldGenerateUniqueTokens() {

        String token1 = jwtService.generateRefreshToken();
        String token2 = jwtService.generateRefreshToken();

        assertNotEquals(token1, token2);
    }

    @Test
    void isTokenValid_ShouldReturnTrue() {

        String token = jwtService.generateAccessToken(user);

        assertTrue(jwtService.isTokenValid(token, user));
    }

    @Test
    void isTokenValid_ShouldReturnFalse_WhenDifferentUser() {

        String token = jwtService.generateAccessToken(user);

        UserDetails userDetails = User.builder()
                .email("another@test.com")
                .password("password")
                .roles(user.getRoles())
                .build();

        assertFalse(jwtService.isTokenValid(token, userDetails));
    }

    @Test
    void extractEmail_ShouldThrow_WhenTokenInvalid() {

        assertThrows(
                JwtException.class,
                () -> jwtService.extractEmail("invalid-token"));
    }

}
