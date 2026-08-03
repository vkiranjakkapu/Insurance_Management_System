package com.ims.policies.service.imp;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.ims.policies.dto.CreateDocumentRequestDto;
import com.ims.policies.enums.DocumentType;
import com.ims.policies.exception.ResourceNotFoundException;
import com.ims.policies.models.Document;
import com.ims.policies.repository.DocumentRepository;
import com.ims.policies.service.CurrentUserService;
import com.ims.policies.service.DocumentsService;

@Service
public class DocumentsServiceImp implements DocumentsService {

    private DocumentRepository documentRepository;
    private CurrentUserService currentUser;

    private final Path storageLocation;

    public DocumentsServiceImp(
            DocumentRepository documentRepository,
            CurrentUserService currentUser,
            @Value("${app.file-storage.base-path}") String basePath) {
        this.documentRepository = documentRepository;
        this.currentUser = currentUser;
        this.storageLocation = Path.of(basePath).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.storageLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not create the upload directory.", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Document getDocumentById(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No Document With Given Id."));
    }

    @Override
    public Document getDocumentByIdAndType(Long id, DocumentType type) {
        return documentRepository.findByIdAndDocumentType(id, type)
                .orElseThrow(() -> new ResourceNotFoundException("No Document With Given Id."));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Document> getAllDocuments() {
        return documentRepository.findAllByIsDeletedFalse();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Document> getAllDocumentsByOwner(UUID ownerId) {
        return documentRepository.findAllByOwnerIdAndIsDeletedFalse(ownerId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Document> getAllDocumentsByOwnerAndType(UUID ownerId, DocumentType type) {
        return documentRepository.findAllByOwnerIdAndDocumentTypeAndIsDeletedFalse(ownerId, type);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Document> getAllDocumentsByType(DocumentType documentType) {
        return documentRepository.findAllByDocumentTypeAndIsDeletedFalse(documentType);
    }

    @Override
    @Transactional
    public Document createDocument(CreateDocumentRequestDto request) {
        Document document = new Document();
        document.setDocumentType(request.documentType());
        document.setOwnerId(currentUser.userId());

        String originalName = resolveOriginalName(request.file().getOriginalFilename(), request.documentType(),
                request.file());
        String storedDocument = storeDocument(request.file(), originalName);
        document.setFileName(originalName);
        document.setFilePath(currentUser.userId().toString().concat("/" + storedDocument));

        return documentRepository.save(document);
    }

    private String resolveOriginalName(String originalName, DocumentType type, MultipartFile file) {
        if (StringUtils.hasText(originalName)) {
            return originalName;
        }

        if (file != null && StringUtils.hasText(file.getOriginalFilename())) {
            return file.getOriginalFilename();
        }

        return type.toString().concat("_" + currentUser.userId().toString());
    }

    public String storeDocument(MultipartFile file, String originalName) {
        // Clean the path to prevent Directory Traversal vulnerabilities
        String fileName = StringUtils.cleanPath(Objects.requireNonNull(originalName));

        try {
            if (fileName.contains("..")) {
                throw new IllegalArgumentException("Filename contains invalid path sequence: " + fileName);
            }

            // Resolve target path
            Path targetDir = this.storageLocation.resolve(currentUser.userId().toString());

            // Create target directory if missing recursively
            if (!Files.exists(targetDir)) {
                Files.createDirectories(targetDir);
            }
            Path targetLocation = targetDir.resolve(fileName);

            // copy file (replace if file with same name exists)
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return fileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file " + fileName, e);
        }
    }

    @Override
    @Transactional
    public boolean deleteDocument(Long id) {
        Document document = getDocumentById(id);
        document.setDeleted(true);
        documentRepository.save(document);
        return true;
    }

}
