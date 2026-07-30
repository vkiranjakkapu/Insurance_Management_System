package com.ims.identity.dto;

import java.util.Collection;
import java.util.UUID;

import jakarta.validation.constraints.NotEmpty;

public record FetchUsersRequestDto(@NotEmpty Collection<UUID> ids) {

}
