package com.ims.identity.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ConfigurationProperties(prefix = "spring.jwt")
public class JwtProperties {

    private String secret;

    private Long accessTokenExpiration;

    private Long refreshTokenExpiration;
}