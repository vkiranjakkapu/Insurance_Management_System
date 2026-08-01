package com.ims.policies.controllers;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ims.policies.dto.APIResponseDto;
import com.ims.policies.enums.DocumentType;
import com.ims.policies.service.DocumentsService;

@RestController
@RequestMapping("/documents/api/v1/kyc")
public class KycDocumentsController {

    private DocumentsService documentService;

    public KycDocumentsController(DocumentsService documentService) {
        this.documentService = documentService;
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT')")
    @GetMapping("/")
    public ResponseEntity<APIResponseDto> getAllKycDocuments() {
        return ResponseEntity
                .ok(APIResponseDto.builder().body(documentService.getAllDocumentsByType(DocumentType.KYC)).build());
    }

    @GetMapping("/{customerId}")
    public ResponseEntity<APIResponseDto> getAllKycDocumentsByCustomer(@PathVariable UUID customerId) {
        return ResponseEntity
                .ok(APIResponseDto.builder().body(documentService.getAllDocumentsByOwner(customerId)).build());
    }
}
