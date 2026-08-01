package com.ims.premiums.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

import com.ims.premiums.enums.SubscriptionStatus;
import com.ims.premiums.models.PolicySubscription;

@Component
public interface PolicySubscriptionRepository extends JpaRepository<PolicySubscription, UUID> {

    List<PolicySubscription> findAllByPolicyId(Long policyId);

    List<PolicySubscription> findAllByCustomerId(UUID id);

    List<PolicySubscription> findAllByStatus(SubscriptionStatus status);

    List<PolicySubscription> findAllByCreatedAtBetween(LocalDate startDate, LocalDate endDate);

    List<PolicySubscription> findAllByPolicyIdAndCreatedAtBetween(Long policyId, LocalDate startDate,
            LocalDate endDate);

}
