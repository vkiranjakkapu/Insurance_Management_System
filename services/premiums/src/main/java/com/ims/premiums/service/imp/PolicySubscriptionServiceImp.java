package com.ims.premiums.service.imp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.IntStream;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ims.premiums.dto.PolicySubscriptionRequestDto;
import com.ims.premiums.dto.UpdateSubscriptionDto;
import com.ims.premiums.enums.SubscriptionStatus;
import com.ims.premiums.exception.ResourceNotFoundException;
import com.ims.premiums.exception.SubscriptionNotFound;
import com.ims.premiums.models.Policy;
import com.ims.premiums.models.PolicySubscription;
import com.ims.premiums.models.PremiumPayment;
import com.ims.premiums.repository.PolicySubscriptionRepository;
import com.ims.premiums.service.CurrentUserService;
import com.ims.premiums.service.PolicyService;
import com.ims.premiums.service.PolicySubscriptionService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PolicySubscriptionServiceImp implements PolicySubscriptionService {

    private PolicySubscriptionRepository subscriptionRepository;
    private PolicyService policyService;
    private CurrentUserService currentUser;

    PolicySubscriptionServiceImp(PolicySubscriptionRepository subscriptionRepository, PolicyService policyService,
            CurrentUserService currentUser) {
        this.subscriptionRepository = subscriptionRepository;
        this.policyService = policyService;
        this.currentUser = currentUser;
    }

    @Override
    @Transactional(readOnly = true)
    public PolicySubscription getSubscriptionById(UUID id) {
        return subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No Subscription With Given ID!"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PolicySubscription> getAllSubscriptionsByCustomer(UUID custId) {
        return subscriptionRepository.findAllByCustomerId(custId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PolicySubscription> getAllPolicySubscriptions() {
        return subscriptionRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PolicySubscription> getAllSubscriptionsByPolicyId(Long policyId) {
        return subscriptionRepository.findAllByPolicyId(policyId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PolicySubscription> getAllPolicySubscriptionsBetween(Long policyId, LocalDate startDate,
            LocalDate endDate) {
        return subscriptionRepository.findAllByPolicyIdAndCreatedAtBetween(policyId, startDate, endDate);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PolicySubscription> getAllSubscriptionsBetween(LocalDate startDate, LocalDate endDate) {
        return subscriptionRepository.findAllByCreatedAtBetween(startDate, endDate);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PolicySubscription> getAllSubscriptionsByStatus(SubscriptionStatus status) {
        return subscriptionRepository.findAllByStatus(status);
    }

    @Override
    @Transactional
    public PolicySubscription createSubscription(PolicySubscriptionRequestDto policySubscriptionRequest) {

        PolicySubscription policySubscription = new PolicySubscription();
        policySubscription.setAgentId(currentUser.userId());
        policySubscription.setStartDate(policySubscriptionRequest.startDate());

        Policy policy = policyService.getPolicyById(policySubscriptionRequest.policyId());
        policySubscription.setPolicyId(policy.getId());
        policySubscription
                .setExpiry(policySubscriptionRequest.startDate().plusMonths(policy.getCoverageDuration().getMonths()));
        policySubscription
                .setEndDate(policySubscriptionRequest.startDate().plusMonths(policy.getPremiumsDuration().getMonths()));

        List<PremiumPayment> premiumPayments = IntStream.range(0, policy.getPremiumsDuration().getMonths()).boxed()
                .map(months -> PremiumPayment.builder()
                        .customerId(policySubscriptionRequest.customerId())
                        .dueDate(policySubscriptionRequest.startDate().plusMonths(months.longValue()))
                        .premiumAmount(policySubscriptionRequest.premiumAmount())
                        .build())
                .toList();
        policySubscription.setPayments(premiumPayments);

        // ? acceptence by customer -> subscription active
        return subscriptionRepository.save(policySubscription);
    }

    @Override
    @Transactional
    public PolicySubscription updateSubscription(UpdateSubscriptionDto request) {

        PolicySubscription policySubscription = getSubscriptionById(request.subscriptionId());
        if (!policySubscription.getCustomerId().equals(currentUser.userId()))
            throw new SubscriptionNotFound("Invalid Subscription!");

        policySubscription.setStatus(SubscriptionStatus.ACTIVE);
        policySubscription.setAcceptanceTime(LocalDateTime.now());

        return subscriptionRepository.save(policySubscription);
    }

}
