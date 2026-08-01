package com.ims.policies.service;

import java.util.List;
import java.util.UUID;

import com.ims.policies.dto.CreateDocumentRequestDto;
import com.ims.policies.enums.DocumentType;
import com.ims.policies.models.Document;

public interface DocumentsService {

    Document getDocumentById(Long id);

    Document getDocumentByIdAndType(Long id, DocumentType type);

    List<Document> getAllDocuments();

    List<Document> getAllDocumentsByType(DocumentType documentType);

    List<Document> getAllDocumentsByOwner(UUID ownerId);

    List<Document> getAllDocumentsByOwnerAndType(UUID ownerId, DocumentType type);

    Document createDocument(CreateDocumentRequestDto document);

    boolean deleteDocument(Long id);

}