package com.ims.identity.dto;

import java.util.List;

import lombok.Builder;

@Builder
public record FetchUsersResponse(List<UserResponse> users) {

}
