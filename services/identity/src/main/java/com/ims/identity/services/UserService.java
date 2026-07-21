package com.ims.identity.services;

import com.ims.identity.dto.CreateUserRequest;
import com.ims.identity.dto.UserResponse;

public interface UserService {
    UserResponse createUser(CreateUserRequest request);
}
