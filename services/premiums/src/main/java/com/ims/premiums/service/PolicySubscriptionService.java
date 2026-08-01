package com.ims.premiums.service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.ims.premiums.dto.PolicySubscriptionRequestDto;
import com.ims.premiums.dto.UpdateSubscriptionDto;
import com.ims.premiums.enums.SubscriptionStatus;
import com.ims.premiums.models.PolicySubscription;

public interface PolicySubscriptionService {

    PolicySubscription getSubscriptionById(UUID id);

    List<PolicySubscription> getAllSubscriptionsByCustomer(UUID custId);

    List<PolicySubscription> getAllPolicySubscriptions();

    List<PolicySubscription> getAllSubscriptionsByPolicyId(Long policyId);

    List<PolicySubscription> getAllPolicySubscriptionsBetween(Long policyId, LocalDate startDate,
            LocalDate endDate);

    List<PolicySubscription> getAllSubscriptionsBetween(LocalDate startDate, LocalDate endDate);

    List<PolicySubscription> getAllSubscriptionsByStatus(SubscriptionStatus status);

    PolicySubscription createSubscription(PolicySubscriptionRequestDto policySubscriptionRequest);

    PolicySubscription updateSubscription(UpdateSubscriptionDto request);

}