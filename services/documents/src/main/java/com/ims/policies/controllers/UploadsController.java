package com.ims.policies.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ims.policies.dto.APIResponseDto;
import com.ims.policies.dto.CreateDocumentRequestDto;
import com.ims.policies.service.DocumentsService;

@RestController
@RequestMapping("/documents/api/v1/uploads")
public class UploadsController {

    private DocumentsService documentService;

    public UploadsController(DocumentsService documentService) {
        this.documentService = documentService;
    }

    @PostMapping("/")
    public ResponseEntity<APIResponseDto> uploadDocument(@ModelAttribute CreateDocumentRequestDto request) {
        return ResponseEntity.ok(APIResponseDto.builder().body(documentService.createDocument(request)).build());
    }

}
