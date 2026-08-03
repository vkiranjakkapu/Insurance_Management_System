package com.ims.premiums.service.imp;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClient;

import com.ims.premiums.dto.FetchUsersRequestDto;
import com.ims.premiums.dto.RestResponseDto;
import com.ims.premiums.dto.UserResponse;
import com.ims.premiums.exception.InternalCommunicationException;
import com.ims.premiums.exception.ResourceNotFoundException;
import com.ims.premiums.models.User;

@Service
public class CustomersServiceImp {

    private final RestClient restClient;

    @Value("${services.uri.identity}")
    private String IDENTITY_SERVICE_URL;

    public CustomersServiceImp(@LoadBalanced RestClient.Builder builder) {

        this.restClient = builder.build();
    }

    public Map<UUID, User> getAllUsersByIds(Set<UUID> userIds) {
        return fetchUsers(userIds).stream()
                .collect(Collectors.toMap(UserResponse::id, u -> prepareUser(u), (existing, replacing) -> existing));
    }

    private User prepareUser(UserResponse userResponse) {
        return User.builder()
                .id(userResponse.id())
                .firstName(userResponse.firstName())
                .lastName(userResponse.lastName())
                .email(userResponse.email())
                .phone(userResponse.phone())
                .gender(userResponse.gender())
                .address(userResponse.address())
                .dob(userResponse.dob())
                .enabled(userResponse.enabled())
                .build();
    }

    private List<UserResponse> fetchUsers(Set<UUID> ids) {
        try {
            RestResponseDto<List<UserResponse>> body = restClient.post().uri(IDENTITY_SERVICE_URL + "/users/search")
                    .body(FetchUsersRequestDto.builder()
                            .ids(ids).build())
                    .retrieve().body(new ParameterizedTypeReference<RestResponseDto<List<UserResponse>>>() {

                    });

            return body.getBody();
        } catch (HttpStatusCodeException e) {
            String rawJsonResponseBody = e.getResponseBodyAsString();
            throw new InternalCommunicationException(rawJsonResponseBody);
        } catch (Exception e) {
            e.printStackTrace();
            throw new ResourceNotFoundException(e.getMessage());
        }
    }
}
