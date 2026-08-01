package com.ims.premiums.service;

import java.util.Collection;
import java.util.UUID;

import com.ims.platform.security.model.AuthenticatedUser;

public interface CurrentUserService {

    AuthenticatedUser currentUser();

    UUID userId();

    String username();

    String email();

    Collection<String> authorities();

    boolean isAdmin();

    boolean isAgent();

    boolean isCustomer();

}