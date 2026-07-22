package com.ims.platform.security.authentication;

import java.util.Optional;

public interface AuthenticationTokenProvider {

    Optional<String> getBearerToken();

}