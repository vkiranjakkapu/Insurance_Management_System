package com.ims.policies.service.imp;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClient;

import com.ims.policies.dto.RestResponseDto;
import com.ims.policies.exception.InternalCommunicationException;
import com.ims.policies.exception.ResourceNotFoundException;
import com.ims.policies.models.Document;
import com.ims.policies.service.DocumentService;

@Service
public class DocumentServiceImp implements DocumentService {

    private final RestClient restClient;

    @Value("${services.uri.documents}")
    private String DOCUMENTS_SERVICE_URL;

    public DocumentServiceImp(@LoadBalanced RestClient.Builder builder) {
        this.restClient = builder.build();
    }

    @Override
    @Transactional(readOnly = true)
    public Document getPolicyDocumentById(Long id) {
        try {
            RestResponseDto<Document> response = restClient.get().uri(DOCUMENTS_SERVICE_URL + "/claims/" + id)
                    .retrieve()
                    .body(new ParameterizedTypeReference<RestResponseDto<Document>>() {
                    });
            return response != null ? response.getBody() : null;
        } catch (HttpStatusCodeException e) {
            String rawJsonResponseBody = e.getResponseBodyAsString();
            throw new InternalCommunicationException(rawJsonResponseBody);
        } catch (Exception e) {
            e.printStackTrace();
            throw new ResourceNotFoundException("Error Connecting Document Service.");
        }
    }

}
