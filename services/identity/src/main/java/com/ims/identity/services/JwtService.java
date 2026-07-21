package com.ims.identity.services;

import org.springframework.security.core.userdetails.UserDetails;

import com.ims.identity.entities.User;

public interface JwtService {

    String generateAccessToken(User user);

    String generateRefreshToken();

    String extractEmail(String token);

    boolean isTokenValid(String token, UserDetails userDetails);

}