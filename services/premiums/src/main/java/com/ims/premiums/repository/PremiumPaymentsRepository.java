package com.ims.premiums.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

import com.ims.premiums.models.PolicySubscription;
import com.ims.premiums.models.PremiumPayment;

@Component
public interface PremiumPaymentsRepository extends JpaRepository<PremiumPayment, UUID> {

    List<PremiumPayment> findAllByCustomerId(UUID customerId);

    List<PremiumPayment> findAllBySubscription(PolicySubscription policySubscription);
    
}
