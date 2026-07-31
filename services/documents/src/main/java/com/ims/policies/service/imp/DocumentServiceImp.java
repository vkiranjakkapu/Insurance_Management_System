package com.ims.policies.service.imp;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ims.policies.exception.ResourceNotFoundException;
import com.ims.policies.models.Document;
import com.ims.policies.repository.DocumentRepository;
import com.ims.policies.service.DocumentService;

@Service
public class DocumentServiceImp implements DocumentService {

    private DocumentRepository documentRepository;

    public DocumentServiceImp(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Document getDocumentById(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No Document With Given Id."));
    }

    @Override
    @Transactional
    public Document createDocument(Document document) {
        return documentRepository.save(document);
    }

    @Override
    @Transactional
    public boolean deleteDocument(Document document) {
        document.setDeleted(true);
        documentRepository.save(document);
        return true;
    }

}
