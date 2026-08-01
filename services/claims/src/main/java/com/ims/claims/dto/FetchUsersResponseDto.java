package com.ims.claims.dto;

import java.util.List;

import com.ims.claims.models.User;

import lombok.Builder;

@Builder
public record FetchUsersResponseDto(List<User> users) {

}
