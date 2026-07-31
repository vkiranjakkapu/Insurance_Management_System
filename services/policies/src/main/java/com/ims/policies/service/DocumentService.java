package com.ims.policies.service;

import com.ims.policies.models.Document;

public interface DocumentService {

    Document getDocumentById(Long id);

    Document createDocument(Document document);

    boolean deleteDocument(Document document);

}