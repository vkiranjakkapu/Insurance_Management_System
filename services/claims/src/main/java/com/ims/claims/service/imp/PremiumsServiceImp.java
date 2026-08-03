package com.ims.claims.service.imp;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClient;

import com.ims.claims.dto.RestResponseDto;
import com.ims.claims.dto.SubscriptionsResposneDto;
import com.ims.claims.exception.InternalCommunicationException;
import com.ims.claims.exception.ResourceNotFoundException;
import com.ims.claims.service.PremiumsService;

@Service
public class PremiumsServiceImp implements PremiumsService {

    private final RestClient restClient;

    @Value("${services.uri.premiums}")
    private String PREMIUMS_SERVICE_URL;

    public PremiumsServiceImp(@LoadBalanced RestClient.Builder builder) {
        this.restClient = builder.build();
    }

    @Override
    @Transactional(readOnly = true)
    public SubscriptionsResposneDto getSubscriptionById(UUID id) {
        try {
            RestResponseDto<SubscriptionsResposneDto> response = restClient.get()
                    .uri(PREMIUMS_SERVICE_URL + "/subscriptions/" + id)
                    .retrieve()
                    .body(new ParameterizedTypeReference<RestResponseDto<SubscriptionsResposneDto>>() {

                    });
            return response.getBody();
        } catch (HttpStatusCodeException e) {
            String rawJsonResponseBody = e.getResponseBodyAsString();
            throw new InternalCommunicationException(rawJsonResponseBody);
        } catch (Exception e) {
            e.printStackTrace();
            throw new ResourceNotFoundException(e.getMessage());
        }
    }

}
