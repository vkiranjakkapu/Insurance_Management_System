package com.ims.claims.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.ims.claims.exception.ForbiddenException;
import com.ims.claims.service.imp.CurrentUserServiceImp;
import com.ims.platform.security.context.AuthenticationContext;
import com.ims.platform.security.model.AuthenticatedUser;

@ExtendWith(MockitoExtension.class)
class CurrentUserServiceImpTest {

    @Mock
    private AuthenticationContext authenticationContext;

    @Mock
    private AuthenticatedUser authenticatedUser;

    private CurrentUserServiceImp service;

    private final UUID userId = UUID.randomUUID();

    @BeforeEach
    void setUp() {

        service = new CurrentUserServiceImp(authenticationContext);

        when(authenticationContext.getCurrentUser())
                .thenReturn(Optional.of(authenticatedUser));

        lenient().when(authenticatedUser.getUserId())
                .thenReturn(userId.toString());

        lenient().when(authenticatedUser.getUsername())
                .thenReturn("john");

        lenient().when(authenticatedUser.getEmail())
                .thenReturn("john@test.com");
    }

    @Test
    void shouldReturnCurrentUser() {

        AuthenticatedUser result = service.currentUser();

        assertSame(authenticatedUser, result);
    }

    @Test
    void shouldThrowWhenNoAuthenticatedUser() {

        when(authenticationContext.getCurrentUser())
                .thenReturn(Optional.empty());

        assertThrows(
                ForbiddenException.class,
                () -> service.currentUser());
    }

    @Test
    void shouldReturnUserId() {

        assertEquals(userId, service.userId());
    }

    @Test
    void shouldReturnUsername() {

        assertEquals("john", service.username());
    }

    @Test
    void shouldReturnEmail() {

        assertEquals("john@test.com", service.email());
    }

    @Test
    void shouldReturnAuthorities() {

        List<String> authorities = List.of(
                "ROLE_ADMIN",
                "ROLE_AGENT");

        when(authenticatedUser.getAuthorities())
                .thenReturn(authorities);

        assertEquals(authorities, service.authorities());
    }

    @Test
    void shouldReturnTrueForAdmin() {

        when(authenticatedUser.getAuthorities())
                .thenReturn(List.of("ROLE_ADMIN"));

        assertTrue(service.isAdmin());
    }

    @Test
    void shouldReturnFalseForAdmin() {

        when(authenticatedUser.getAuthorities())
                .thenReturn(List.of("ROLE_AGENT"));

        assertFalse(service.isAdmin());
    }

    @Test
    void shouldReturnTrueForAgent() {

        when(authenticatedUser.getAuthorities())
                .thenReturn(List.of("ROLE_AGENT"));

        assertTrue(service.isAgent());
    }

    @Test
    void shouldReturnFalseForAgent() {

        when(authenticatedUser.getAuthorities())
                .thenReturn(List.of("ROLE_CUSTOMER"));

        assertFalse(service.isAgent());
    }

    @Test
    void shouldReturnTrueForCustomer() {

        when(authenticatedUser.getAuthorities())
                .thenReturn(List.of("ROLE_CUSTOMER"));

        assertTrue(service.isCustomer());
    }

    @Test
    void shouldReturnFalseForCustomer() {

        when(authenticatedUser.getAuthorities())
                .thenReturn(List.of("ROLE_ADMIN"));

        assertFalse(service.isCustomer());
    }
}