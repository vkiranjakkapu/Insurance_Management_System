package com.ims.premiums.service.imp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ims.premiums.dto.PolicySubscriptionRequestDto;
import com.ims.premiums.dto.PremiumPaymentResponseDto;
import com.ims.premiums.dto.SubscriptionsResposneDto;
import com.ims.premiums.dto.UpdateSubscriptionDto;
import com.ims.premiums.enums.SubscriptionStatus;
import com.ims.premiums.exception.ResourceNotFoundException;
import com.ims.premiums.exception.SubscriptionNotFound;
import com.ims.premiums.models.Policy;
import com.ims.premiums.models.PolicySubscription;
import com.ims.premiums.models.PremiumPayment;
import com.ims.premiums.models.User;
import com.ims.premiums.repository.PolicySubscriptionRepository;
import com.ims.premiums.service.CurrentUserService;
import com.ims.premiums.service.PolicyService;
import com.ims.premiums.service.PolicySubscriptionService;

@Service
public class PolicySubscriptionServiceImp implements PolicySubscriptionService {

    private PolicySubscriptionRepository subscriptionRepository;
    private PolicyService policyService;
    private CurrentUserService currentUser;
    private CustomersServiceImp customersService;

    PolicySubscriptionServiceImp(PolicySubscriptionRepository subscriptionRepository, PolicyService policyService,
            CurrentUserService currentUser,
            CustomersServiceImp customersService) {
        this.subscriptionRepository = subscriptionRepository;
        this.policyService = policyService;
        this.currentUser = currentUser;
        this.customersService = customersService;
    }

    @Override
    @Transactional(readOnly = true)
    public PolicySubscription getSubscriptionById(UUID id) {
        return subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No Subscription With Given ID!"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PolicySubscription> getAllSubscriptionsByAgent(UUID agentId) {
        return subscriptionRepository.findAllByAgentId(agentId);
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
    public List<SubscriptionsResposneDto> getAllPolicySubscriptionsPrepared(List<PolicySubscription> allSubscriptions) {

        Set<UUID> userIds = allSubscriptions.stream()
                .flatMap((sub) -> Stream.of(sub.getCustomerId(), sub.getAgentId()))
                .collect(Collectors.toSet());
        Set<Long> policyIds = allSubscriptions.stream().map(sub -> sub.getPolicyId())
                .collect(Collectors.toSet());

        Map<UUID, User> allUsers = customersService.getAllUsersByIds(userIds);
        System.out.println(allUsers);
        Map<Long, Policy> allPolicies = policyService.getAllPolicyByIds(new ArrayList<>(policyIds));

        return allSubscriptions.stream().map(sub -> {
            System.out.println(sub.getCustomerId());
            System.out.println(allUsers.get(sub.getCustomerId()));

            return SubscriptionsResposneDto.builder()
                .id(sub.getId())
                .customer(allUsers.get(sub.getCustomerId()))
                .customerName(allUsers.get(sub.getCustomerId()).getFirstName())
                .policy(allPolicies.get(sub.getPolicyId()))
                .policyId(allPolicies.get(sub.getPolicyId()).getPolicyId())
                .policyType(allPolicies.get(sub.getPolicyId()).getPolicyType().toString())
                .startDate(sub.getStartDate())
                .endDate(sub.getEndDate())
                .expiry(sub.getExpiry())
                .payments(
                        sub.getPayments().stream().map(prem -> PremiumPaymentResponseDto.builder()
                                .id(prem.getId())
                                .method(prem.getMethod())
                                .amountPayed(prem.getAmountPayed())
                                .premiumAmount(prem.getPremiumAmount())
                                .status(prem.getStatus())
                                .dueDate(prem.getDueDate())
                                .paymentTime(prem.getPaymentTime())
                                .createdAt(prem.getCreatedAt())
                                .build()).toList())
                .status(sub.getStatus())
                .acceptanceTime(sub.getAcceptanceTime())
                .agent(allUsers.get(sub.getAgentId()))
                .agentEmail(Optional.ofNullable(allUsers.get(sub.getAgentId()).getEmail()).orElse("agent not assigned yet"))
                .updatedAt(sub.getUpdatedAt())
                .createdAt(sub.getCreatedAt())
                .build();
            
        }).toList();
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
    public List<PolicySubscription> createSubscription(PolicySubscriptionRequestDto request) {

        List<PolicySubscription> subscriptions = new ArrayList<PolicySubscription>();
        Map<Long, Policy> policies = policyService.getAllPolicyByIds(request.policyIds());

        request.policyIds().forEach(policyId -> {

            PolicySubscription subscription = PolicySubscription.builder()
                    .customerId(request.customerId())
                    .agentId(currentUser.userId())
                    .startDate(request.startDate())
                    .policyId(policyId)
                    .expiry(request.startDate().plus(policies.get(policyId).getCoverageDuration()))
                    .endDate(request.startDate().plus(policies.get(policyId).getPremiumsDuration()))
                    .build();

            int totalMonths = (int) policies.get(policyId).getPremiumsDuration().toTotalMonths();

            List<PremiumPayment> premiumPayments = IntStream
                    .range(0, totalMonths)
                    .boxed()
                    .map(months -> PremiumPayment.builder()
                            .customerId(request.customerId())
                            .subscription(subscription)
                            .dueDate(request.startDate().plusMonths(months))
                            .premiumAmount(request.premiumAmount())
                            .build())
                    .toList();

            subscription.setPayments(premiumPayments);
            subscriptions.add(subscription);
        });

        // ? acceptence by customer -> subscription active
        return subscriptionRepository.saveAll(subscriptions);
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
