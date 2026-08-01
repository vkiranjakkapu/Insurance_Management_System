package com.ims.claims.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

import com.ims.claims.models.ClaimProof;

@Component
public interface ClaimProofRepository extends JpaRepository<ClaimProof, Long> {
    
}
