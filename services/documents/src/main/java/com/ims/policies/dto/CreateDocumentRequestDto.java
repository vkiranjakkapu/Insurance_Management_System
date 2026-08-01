package com.ims.policies.dto;

import org.springframework.web.multipart.MultipartFile;

import com.ims.policies.enums.DocumentType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record CreateDocumentRequestDto(
		@NotBlank String fileName,
		@NotNull MultipartFile file,
		@NotBlank DocumentType documentType) {

}
