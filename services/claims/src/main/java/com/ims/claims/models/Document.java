package com.ims.claims.models;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Document {

    private Long id;

    private UUID ownerId;

    private String fileName;

    private String filePath;

    private boolean isDeleted;

    private LocalDateTime createdAt;

}
