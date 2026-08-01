package com.ims.claims.service.imp;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import com.ims.claims.models.Document;
import com.ims.claims.service.DocumentService;

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
    public Document getDocumentById(Long id) {
        return restClient.get().uri(DOCUMENTS_SERVICE_URL + "/claims/" + id).retrieve()
                .body(Document.class);
    }

}
