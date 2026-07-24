package com.ims.platform.restclient.customizer;

import org.springframework.boot.web.client.RestClientCustomizer;
import org.springframework.web.client.RestClient;

import com.ims.platform.restclient.interceptor.RestClientInterceptor;

/**
 * Responsibility:
 * Registers IMS HTTP context propagation interceptor
 * on every RestClient.Builder managed by Spring Boot.
 *
 * Why:
 * Keeps applications free from manual interceptor registration.
 *
 * Does NOT:
 * Create RestClients or perform header propagation itself.
 */
public final class DefaultRestClientCustomizer
        implements RestClientCustomizer {

    private final RestClientInterceptor interceptor;

    public DefaultRestClientCustomizer(
            RestClientInterceptor interceptor) {
        this.interceptor = interceptor;
    }

    @Override
    public void customize(RestClient.Builder builder) {
        builder.requestInterceptor(interceptor);
    }
}