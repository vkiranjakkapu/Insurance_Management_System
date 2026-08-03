package com.ims.policies.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ims.policies.dto.APIResponseDto;
import com.ims.policies.enums.DocumentType;
import com.ims.policies.models.Document;
import com.ims.policies.service.CurrentUserService;
import com.ims.policies.service.DocumentsService;

@RestController
@RequestMapping("/documents/api/v1/claims")
public class ClaimDocumentsController {

    private DocumentsService documentService;
    private CurrentUserService currentUser;

    public ClaimDocumentsController(DocumentsService documentService, CurrentUserService currentUser) {
        this.documentService = documentService;
        this.currentUser = currentUser;
    }

    @GetMapping({ "", "/" })
    @PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
    public ResponseEntity<APIResponseDto> getAllClaimDocuments() {
        List<Document> allDocuments;
        if (currentUser.isCustomer()) {
            allDocuments = documentService.getAllDocumentsByOwnerAndType(currentUser.userId(),
                    DocumentType.CLAIM_PROOF);
        }
        allDocuments = documentService.getAllDocumentsByType(DocumentType.CLAIM_PROOF);

        return ResponseEntity.ok(APIResponseDto.builder().body(allDocuments).build());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('AGENT','ADMIN','CUSTOMER')")
    public ResponseEntity<APIResponseDto> getDocumentById(@PathVariable Long id) {
        return ResponseEntity
                .ok(APIResponseDto.builder()
                        .body(documentService.getDocumentById(id))
                        .build());
    }

    @GetMapping("/owner/{ownerId}")
    @PreAuthorize("hasAnyRole('AGENT','ADMIN')")
    public ResponseEntity<APIResponseDto> getAllDocumentsByOwner(@PathVariable UUID ownerId) {
        return ResponseEntity
                .ok(APIResponseDto.builder()
                        .body(documentService.getAllDocumentsByOwnerAndType(ownerId, DocumentType.CLAIM_PROOF))
                        .build());
    }

}
