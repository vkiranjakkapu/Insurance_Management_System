package com.ims.policies.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

import com.ims.policies.enums.DocumentType;
import com.ims.policies.models.Document;

@Component
public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findAllByIsDeletedFalse();

    List<Document> findAllByOwnerIdAndIsDeletedFalse(UUID ownerId);

    List<Document> findAllByDocumentTypeAndIsDeletedFalse(DocumentType documentType);

    List<Document> findAllByOwnerIdAndDocumentTypeAndIsDeletedFalse(UUID ownerId, DocumentType type);

    Optional<Document> findByIdAndDocumentType(Long id, DocumentType type);
    
}
