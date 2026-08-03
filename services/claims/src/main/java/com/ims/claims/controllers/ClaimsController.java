package com.ims.claims.controllers;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ims.claims.dto.APIResponseDto;
import com.ims.claims.dto.AssignClaimRequestDto;
import com.ims.claims.dto.ClaimResponseDto;
import com.ims.claims.dto.CreateClaimRequestDto;
import com.ims.claims.dto.SubscriptionsResposneDto;
import com.ims.claims.dto.UpdateClaimRequestDto;
import com.ims.claims.exception.UnauthorizedException;
import com.ims.claims.models.Claim;
import com.ims.claims.models.User;
import com.ims.claims.service.ClaimService;
import com.ims.claims.service.CurrentUserService;
import com.ims.claims.service.PremiumsService;
import com.ims.claims.service.imp.CustomersServiceImp;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/claims/api/v1")
public class ClaimsController {

    private final ClaimService claimService;
    private final CurrentUserService currentUser;
    private final PremiumsService premiumsService;
    private final CustomersServiceImp customersService;

    public ClaimsController(
            ClaimService claimService,
            CurrentUserService currentUser,
            PremiumsService premiumsService,
            CustomersServiceImp customersService) {
        this.claimService = claimService;
        this.currentUser = currentUser;
        this.premiumsService = premiumsService;
        this.customersService = customersService;
    }

    @Operation(summary = "Get All Claims")
    @GetMapping("/")
    public ResponseEntity<APIResponseDto> getAllClaims() {
        List<Claim> allClaims = getAllClaimsByRole();

        Set<UUID> userIds = allClaims.stream()
                .flatMap((claim) -> Stream.of(claim.getCustomerId(), claim.getAgentId(), claim.getResolverId()))
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        Map<UUID, User> userMap = customersService.getAllUsersByIds(userIds);

        List<ClaimResponseDto> claims = allClaims.stream().map(claim -> claimService.mapClaimResponse(claim, userMap))
                .toList();

        return ResponseEntity.ok(APIResponseDto.builder().body(claims).build());
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

    @Operation(summary = "Get claim by ID")
    @GetMapping("/{claimId}")
    public ResponseEntity<APIResponseDto> getClaimById(@PathVariable String claimId) {
        return ResponseEntity.ok(APIResponseDto.builder()
                .body(claimService.mapClaimResponse(claimService.getClaimByClaimId(claimId))).build());
    }

    @Operation(summary = "Raise new claim")
    @PostMapping("/")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<APIResponseDto> createClaim(@Valid @RequestBody CreateClaimRequestDto claimReq) {
        SubscriptionsResposneDto subscription = premiumsService.getSubscriptionById(claimReq.subscriptionId());
        if (!subscription.customer().getId().equals(claimReq.customerId()))
            throw new UnauthorizedException("Mismatch Identified.");
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
        return ResponseEntity.ok(APIResponseDto.builder()
                .body(claimService.mapClaimResponse(claimService.updateClaim(request))).build());
    }

}
