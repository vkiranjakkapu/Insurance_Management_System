package com.ims.claims.controllers;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

import com.ims.claims.dto.APIResponseDto;
import com.ims.claims.dto.AssignClaimRequestDto;
import com.ims.claims.dto.ClaimResponseDto;
import com.ims.claims.dto.CreateClaimRequestDto;
import com.ims.claims.dto.FetchUsersRequestDto;
import com.ims.claims.dto.FetchUsersResponseDto;
import com.ims.claims.dto.UpdateClaimRequestDto;
import com.ims.claims.models.Claim;
import com.ims.claims.models.Document;
import com.ims.claims.models.User;
import com.ims.claims.service.ClaimService;
import com.ims.claims.service.CurrentUserService;
import com.ims.claims.service.DocumentService;
import com.ims.claims.service.PremiumsService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/v1/policies/claims")
public class ClaimsController {

    private final ClaimService claimService;
    private final CurrentUserService currentUser;
    private final DocumentService documentService;
    private final PremiumsService premiumsService;
    private final RestClient restClient;

    @Value("${services.uri.identity}")
    private String IDENTITY_SERVICE_URL;

    @Value("${services.uri.premiums}")
    private String PREMIUM_SERVICE_URL;

    public ClaimsController(
            ClaimService claimService,
            CurrentUserService currentUser,
            DocumentService documentService,
            PremiumsService premiumsService,
            @LoadBalanced RestClient.Builder builder) {
        this.claimService = claimService;
        this.currentUser = currentUser;
        this.documentService = documentService;
        this.premiumsService = premiumsService;
        this.restClient = builder.build();
    }

    @Operation(summary = "Get All Claims")
    @GetMapping("/")
    public ResponseEntity<APIResponseDto> getAllClaims() {
        List<Claim> allClaims = getAllClaimsByRole();

        Set<UUID> userIds = allClaims.stream()
                .flatMap((claim) -> Stream.of(claim.getCustomerId(), claim.getAgentId(), claim.getResolverId()))
                .collect(Collectors.toSet());

        Map<UUID, User> userMap = fetchUsers(userIds).stream()
                .collect(Collectors.toMap(User::getId, u -> u, (existing, replacing) -> existing));

        List<ClaimResponseDto> claims = allClaims.stream().map(claim -> ClaimResponseDto.builder()
                .id(claim.getId())
                .subscription(premiumsService.getSubscriptionById(claim.getSubscriptionId()))
                .claimId(claim.getClaimId())
                .reason(claim.getReason())
                .proofs(claim.getProofs().stream().map(proof -> getDocumentById(proof.getDocumentId())).toList())
                .status(claim.getStatus())
                .customer(userMap.get(claim.getCustomerId()))
                .agent(userMap.get(claim.getAgentId()))
                .resolver(userMap.get(claim.getResolverId()))
                .updatedAt(claim.getUpdatedAt())
                .createdAt(claim.getCreatedAt())
                .build()).toList();

        return ResponseEntity.ok(APIResponseDto.builder().body(claims).build());
    }

    private Document getDocumentById(Long documentId) {
        return documentService.getDocumentById(documentId);
    }

    private List<Claim> getAllClaimsByRole() {
        if (currentUser.isAdmin()) {
            return claimService.getAllClaims();
        }
        if (currentUser.isAgent()) {
            return claimService.getAllClaimsByAgent(currentUser.userId());
        }
        return claimService.getAllClaimsByCustomer(currentUser.userId());
    }

    private List<User> fetchUsers(Set<UUID> ids) {
        FetchUsersResponseDto body = restClient.post().uri(IDENTITY_SERVICE_URL + "search")
                .body(FetchUsersRequestDto.builder()
                        .ids(ids).build())
                .retrieve().body(FetchUsersResponseDto.class);
        return body.users();
    }

    @Operation(summary = "Get claim by ID")
    @GetMapping("/{id}")
    public ResponseEntity<APIResponseDto> getClaimById(@RequestParam Long id) {
        return ResponseEntity.ok(APIResponseDto.builder().body(claimService.getClaimById(id)).build());
    }

    @Operation(summary = "Raise new claim")
    @PostMapping("/")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<APIResponseDto> createClaim(@RequestBody CreateClaimRequestDto claimReq) {
        return ResponseEntity.ok(APIResponseDto.builder().body(claimService.createClaim(claimReq)).build());
    }

    @Operation(summary = "Assign claim to agent")
    @PatchMapping("/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<APIResponseDto> assignClaim(@RequestBody AssignClaimRequestDto request) {
        return ResponseEntity.ok(APIResponseDto.builder().body(claimService.assignClaimToAgent(request)).build());
    }

    @Operation(summary = "Update claim")
    @PutMapping("/")
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT')")
    public ResponseEntity<APIResponseDto> updateClaim(@RequestBody UpdateClaimRequestDto request) {
        return ResponseEntity.ok(APIResponseDto.builder().body(claimService.updateClaim(request)).build());
    }

}
