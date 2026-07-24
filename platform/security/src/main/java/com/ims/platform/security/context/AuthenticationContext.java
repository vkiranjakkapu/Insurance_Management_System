package com.ims.platform.security.context;

import java.util.Optional;

import com.ims.platform.security.model.AuthenticatedUser;

public interface AuthenticationContext {

    Optional<AuthenticatedUser> getCurrentUser();

    boolean isAuthenticated();
}