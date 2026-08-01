package com.ims.premiums.service.imp;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import com.ims.premiums.dto.FetchPolicyRequestDto;
import com.ims.premiums.exception.ResourceNotFoundException;
import com.ims.premiums.models.Policy;
import com.ims.premiums.service.PolicyService;

@Service
@Transactional
public class PolicyServiceImp implements PolicyService {

    private final RestClient restClient;

    @Value("${services.uri.documents}")
    private String POLICIES_SERVICE_URL;

    public PolicyServiceImp(@LoadBalanced RestClient.Builder builder) {

        this.restClient = builder.build();
    }

    @Override
    @Transactional(readOnly = true)
    public Policy getPolicyById(Long id) {
        try {
            FetchPolicyRequestDto body = restClient.get().uri(POLICIES_SERVICE_URL + "/" + id).retrieve()
                .body(FetchPolicyRequestDto.class);
            return body.policy();
        } catch (Exception e) {
            throw new ResourceNotFoundException("Policy with Given Id Not Found");
        }
    }

}
