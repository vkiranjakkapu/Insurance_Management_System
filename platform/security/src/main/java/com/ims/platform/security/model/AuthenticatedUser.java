package com.ims.platform.security.model;

import java.util.Collection;

public interface AuthenticatedUser {

    String getUserId();

    String getUsername();

    Collection<String> getAuthorities();

}