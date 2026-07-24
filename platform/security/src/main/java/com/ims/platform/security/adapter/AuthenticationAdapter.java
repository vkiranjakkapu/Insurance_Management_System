package com.ims.platform.security.adapter;

import org.springframework.security.core.Authentication;

import com.ims.platform.security.model.AuthenticatedUser;

public interface AuthenticationAdapter {

    AuthenticatedUser adapt(Authentication authentication);

}