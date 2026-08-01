package com.ims.claims.service.imp;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import com.ims.claims.dto.PolicySubscriptionRequestDto;
import com.ims.claims.models.PolicySubscription;
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
    public PolicySubscription getSubscriptionById(UUID id) {
        PolicySubscriptionRequestDto response = restClient.get().uri(PREMIUMS_SERVICE_URL + "/policies/" + id)
                .retrieve()
                .body(PolicySubscriptionRequestDto.class);
        return response.body();
    }

}
