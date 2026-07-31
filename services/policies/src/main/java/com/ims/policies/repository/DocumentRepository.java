package com.ims.policies.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

import com.ims.policies.models.Document;

@Component
public interface DocumentRepository extends JpaRepository<Document, Long> {
    
}
