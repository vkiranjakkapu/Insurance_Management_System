package com.ims.identity.services;

import com.ims.identity.dto.LoginRequestDto;
import com.ims.identity.dto.LoginResponseDto;
import com.ims.identity.dto.LogoutRequestDto;
import com.ims.identity.dto.RefreshTokenRequest;
import com.ims.identity.dto.RefreshTokenResponse;

public interface AuthenticationService {

    LoginResponseDto login(LoginRequestDto request);

    RefreshTokenResponse refresh(RefreshTokenRequest request);

    void logout(LogoutRequestDto request);

}