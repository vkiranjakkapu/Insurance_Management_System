package com.ims.claims.service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.ims.claims.dto.AssignClaimRequestDto;
import com.ims.claims.dto.ClaimResponseDto;
import com.ims.claims.dto.CreateClaimRequestDto;
import com.ims.claims.dto.UpdateClaimRequestDto;
import com.ims.claims.enums.ClaimStatus;
import com.ims.claims.models.Claim;
import com.ims.claims.models.User;

public interface ClaimService {

    Claim getClaimById(Long id);

    Claim getClaimByClaimId(String id);

    ClaimResponseDto mapClaimResponse(Claim claim);

    ClaimResponseDto mapClaimResponse(Claim claim, Map<UUID, User> allUsers);

    List<Claim> getAllClaims();

    List<Claim> getAllClaimsByAgent(UUID id);

    List<Claim> getAllClaimsByCustomer(UUID customerId);

    List<Claim> getAllByStatus(ClaimStatus status);

    Claim assignClaimToAgent(AssignClaimRequestDto request);

    Claim createClaim(CreateClaimRequestDto claimRequest);

    Claim updateClaim(UpdateClaimRequestDto request);

}