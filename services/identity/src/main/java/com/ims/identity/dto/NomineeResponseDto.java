package com.ims.identity.dto;

import com.ims.identity.entities.User;
import com.ims.identity.enums.RelationshipType;

import lombok.Builder;

@Builder
public record NomineeResponseDto(Long id,
        String name,
        String email,
        String phone,
        RelationshipType relationship,
        User customer) {

}
