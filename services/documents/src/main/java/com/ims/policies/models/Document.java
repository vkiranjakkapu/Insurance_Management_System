package com.ims.policies.models;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import com.ims.policies.enums.DocumentType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "documents")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "owner_id")
    private UUID ownerId;

    private String fileName;

    private String filePath;

    @Builder.Default()
    @Enumerated(EnumType.STRING)
    private DocumentType documentType = DocumentType.KYC;

    @Builder.Default()
    @Column(name = "deleted")
    private boolean isDeleted = false;

    @CreationTimestamp
    private LocalDateTime createdAt;

}
