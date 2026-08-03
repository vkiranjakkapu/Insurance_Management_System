package com.ims.policies.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

import com.ims.policies.enums.PolicyStatus;
import com.ims.policies.models.Policy;

@Component
public interface PolicyRepository extends JpaRepository<Policy, Long> {

    List<Policy> findAllByIsLatestTrue();

    List<Policy> findAllByStatusAndIsLatestTrue(PolicyStatus status);

    Optional<Policy> findByPolicyId(String id);

}
