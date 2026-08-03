package com.ims.claims.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Component;

import com.ims.claims.enums.ClaimStatus;
import com.ims.claims.models.Claim;

@Component
public interface ClaimRepository extends JpaRepository<Claim, Long> {

    List<Claim> findAllByCustomerId(UUID customerId);

    @Query(value = "SELECT nextval('claim_id_seq')", nativeQuery = true)
    Long getNextCalimIdSequence();

    List<Claim> findAllByStatus(ClaimStatus status);

    List<Claim> findAllByAgentId(UUID id);

    Optional<Claim> findByClaimId(String claimId);
    
}
