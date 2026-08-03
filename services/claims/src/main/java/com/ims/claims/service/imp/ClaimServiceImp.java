package com.ims.claims.service.imp;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ims.claims.dto.AssignClaimRequestDto;
import com.ims.claims.dto.ClaimProofDto;
import com.ims.claims.dto.ClaimResponseDto;
import com.ims.claims.dto.CreateClaimRequestDto;
import com.ims.claims.dto.UpdateClaimRequestDto;
import com.ims.claims.enums.ClaimStatus;
import com.ims.claims.exception.ForbiddenException;
import com.ims.claims.exception.ResourceNotFoundException;
import com.ims.claims.models.Claim;
import com.ims.claims.models.ClaimProof;
import com.ims.claims.models.User;
import com.ims.claims.repository.ClaimRepository;
import com.ims.claims.service.ClaimService;
import com.ims.claims.service.CurrentUserService;
import com.ims.claims.service.DocumentService;
import com.ims.claims.service.PremiumsService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClaimServiceImp implements ClaimService {

    private final CustomersServiceImp customersService;
    private final ClaimRepository claimRepository;
    private final DocumentService documentService;
    private final CurrentUserService currentUser;
    private final PremiumsService premiumsService;

    @Override
    @Transactional(readOnly = true)
    public Claim getClaimById(Long id) {
        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No claim found with given id"));
        if (!currentUser.isAdmin()) {
            if (currentUser.isCustomer() && claim.getCustomerId() != currentUser.userId()) {
                throw new ForbiddenException("Forbidden Access Attempted!");
            } else if (currentUser.isAgent() && claim.getAgentId() != currentUser.userId()) {
                throw new ForbiddenException("Claim not assigned to you.");
            }
        }
        return claim;
    }

    @Override
    @Transactional(readOnly = true)
    public Claim getClaimByClaimId(String claimId) {
        Claim claim = claimRepository.findByClaimId(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found"));
        if (!currentUser.isAdmin()) {
            if (currentUser.isCustomer() && !claim.getCustomerId().equals(currentUser.userId())) {
                throw new ForbiddenException("Forbidden Access Attempted!");
            } else if (currentUser.isAgent() && !claim.getAgentId().equals(currentUser.userId())) {
                throw new ForbiddenException("Claim not assigned to you.");
            }
        }

        return claim;
    }

    @Override
    public ClaimResponseDto mapClaimResponse(Claim claim) {

        Set<UUID> userIds = Stream.of(claim.getCustomerId(), claim.getAgentId(), claim.getResolverId())
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Map<UUID, User> allUsers = customersService.getAllUsersByIds(userIds);

        return ClaimResponseDto.builder()
                .id(claim.getId())
                .subscription(premiumsService.getSubscriptionById(claim.getSubscriptionId()))
                .claimId(claim.getClaimId())
                .reason(claim.getReason())
                .proofs(claim.getProofs().stream().map(ClaimProof::getDocumentId).toList().stream()
                        .map(docId -> documentService.getDocumentById(docId)).toList())
                .status(claim.getStatus())
                .agent(allUsers.get(claim.getAgentId()))
                .resolver(allUsers.get(claim.getResolverId()))
                .updatedAt(claim.getUpdatedAt())
                .createdAt(claim.getCreatedAt())
                .build();
    }

    @Override
    public ClaimResponseDto mapClaimResponse(Claim claim, Map<UUID, User> allUsers) {
        return ClaimResponseDto.builder()
                .id(claim.getId())
                .subscription(premiumsService.getSubscriptionById(claim.getSubscriptionId()))
                .claimId(claim.getClaimId())
                .reason(claim.getReason())
                .proofs(claim.getProofs().stream().map(ClaimProof::getDocumentId).toList().stream()
                        .map(docId -> documentService.getDocumentById(docId)).toList())
                .status(claim.getStatus())
                .agent(allUsers.get(claim.getAgentId()))
                .resolver(allUsers.get(claim.getResolverId()))
                .updatedAt(claim.getUpdatedAt())
                .createdAt(claim.getCreatedAt())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Claim> getAllClaims() {
        return claimRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Claim> getAllClaimsByAgent(UUID id) {
        return claimRepository.findAllByAgentId(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Claim> getAllClaimsByCustomer(UUID customerId) {
        return claimRepository.findAllByCustomerId(customerId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Claim> getAllByStatus(ClaimStatus status) {
        return claimRepository.findAllByStatus(status);
    }

    @Override
    public Claim assignClaimToAgent(AssignClaimRequestDto request) {

        Claim claim = getClaimById(request.claimId());
        claim.setAgentId(request.agentId());
        claim.setAgentName(request.dealerName());
        claim.setStatus(ClaimStatus.ASSIGNED);
        claim.setResolverId(currentUser.userId());

        return claimRepository.save(claim);
    }

    @Override
    @Transactional
    public Claim createClaim(CreateClaimRequestDto claimRequest) {
        // ? customerId, subscriptionId, proofDocs
        Claim claim = new Claim();
        claim.setReason(claimRequest.reason());
        claim.setCustomerId(claimRequest.customerId());
        claim.setSubscriptionId(claimRequest.subscriptionId());
        System.out.println(claimRequest);

        claim.setProofs(claimRequest.proofs().stream()
                .map(this::mapToProof)
                .map(cp -> {
                    cp.setClaim(claim);
                    return cp;
                })
                .toList());
        claim.setResolverId(currentUser.userId());

        return claimRepository.save(claim);
    }

    private ClaimProof mapToProof(ClaimProofDto claimProofDto) {
        return ClaimProof.builder().documentId(documentService.getDocumentById(claimProofDto.getDocId()).getId())
                .build();
    }

    @Override
    @Transactional
    public Claim updateClaim(UpdateClaimRequestDto request) {
        Claim claim = getClaimById(request.claimId());

        if (currentUser.isAgent() && claim.getAgentId() != currentUser.userId())
            throw new ForbiddenException("This claim is not assigned to you!.");

        claim.setStatus(request.status());
        claim.setResolverId(currentUser.userId());

        return claimRepository.save(claim);
    }

}
