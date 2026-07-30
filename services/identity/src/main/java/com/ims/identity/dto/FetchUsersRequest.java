package com.ims.identity.dto;

import java.util.Collection;
import java.util.UUID;

public record FetchUsersRequest(Collection<UUID> ids) {

}
