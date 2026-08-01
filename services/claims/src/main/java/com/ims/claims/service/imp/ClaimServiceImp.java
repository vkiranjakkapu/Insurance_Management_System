package com.ims.claims.service.imp;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ims.claims.dto.AssignClaimRequestDto;
import com.ims.claims.dto.ClaimProofDto;
import com.ims.claims.dto.CreateClaimRequestDto;
import com.ims.claims.dto.UpdateClaimRequestDto;
import com.ims.claims.enums.ClaimStatus;
import com.ims.claims.exception.ForbiddenException;
import com.ims.claims.exception.ResourceNotFoundException;
import com.ims.claims.exception.SubscriptionNotFound;
import com.ims.claims.models.Claim;
import com.ims.claims.models.ClaimProof;
import com.ims.claims.models.PolicySubscription;
import com.ims.claims.repository.ClaimRepository;
import com.ims.claims.service.ClaimService;
import com.ims.claims.service.CurrentUserService;
import com.ims.claims.service.DocumentService;
import com.ims.claims.service.PremiumsService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClaimServiceImp implements ClaimService {

    private final ClaimRepository claimRepository;
    private final DocumentService documentService;
    private final PremiumsService premiumsService;
    private final CurrentUserService currentUser;

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
        claim.setStatus(claimRequest.status());

        PolicySubscription subscription = premiumsService.getSubscriptionById(claimRequest.subscriptionId());

        if (!subscription.getCustomerId().equals(currentUser.userId()))
            throw new SubscriptionNotFound("Subscription Not Found!");

        claim.setSubscriptionId(subscription.getId());

        claim.setProofs(claimRequest.proofs().stream()
                .map(this::mapToProof)
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
