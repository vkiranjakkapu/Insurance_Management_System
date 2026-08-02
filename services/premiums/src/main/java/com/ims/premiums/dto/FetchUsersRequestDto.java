package com.ims.premiums.dto;

import java.util.Collection;
import java.util.UUID;

import lombok.Builder;

@Builder
public record FetchUsersRequestDto(Collection<UUID> ids) {

}
