package com.ims.premiums.service.imp;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClient;

import com.ims.premiums.dto.FetchPolicyRequestDto;
import com.ims.premiums.dto.RestResponseDto;
import com.ims.premiums.exception.InternalCommunicationException;
import com.ims.premiums.exception.ResourceNotFoundException;
import com.ims.premiums.models.Policy;
import com.ims.premiums.service.PolicyService;

@Service
public class PolicyServiceImp implements PolicyService {

    private final RestClient restClient;

    @Value("${services.uri.policies}")
    private String POLICIES_SERVICE_URL;

    public PolicyServiceImp(@LoadBalanced RestClient.Builder builder) {

        this.restClient = builder.build();
    }

    @Override
    public Policy getPolicyById(Long id) {
        try {
            FetchPolicyRequestDto body = restClient.get().uri(POLICIES_SERVICE_URL + "/" + id).retrieve()
                    .body(FetchPolicyRequestDto.class);
            return body.body();
        } catch (Exception e) {
            throw new ResourceNotFoundException("Policy with Given Id Not Found");
        }
    }

    @Override
    public Map<Long, Policy> getAllPolicyByIds(List<Long> ids) {
        try {
            RestResponseDto<List<Policy>> body = restClient.post().uri(POLICIES_SERVICE_URL + "/policies/search/")
                    .body(ids)
                    .retrieve()
                    .body(new ParameterizedTypeReference<RestResponseDto<List<Policy>>>() {
                    });
            Map<Long, Policy> policiesMap = body.getBody().stream()
                    .collect(Collectors.toMap(Policy::getId, u -> u, (existing, replacing) -> existing));

            return policiesMap;
        } catch (HttpStatusCodeException e) {
            String rawJsonResponseBody = e.getResponseBodyAsString();
            throw new InternalCommunicationException(rawJsonResponseBody);
        } catch (Exception e) {
            e.printStackTrace();
            throw new ResourceNotFoundException(e.getMessage());
        }
    }

}
