package com.ims.policies.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

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
import com.ims.premiums.service.imp.PolicySubscriptionServiceImp;

@ExtendWith(MockitoExtension.class)
class PolicySubscriptionServiceImpTest {

    @Mock
    private PolicySubscriptionRepository subscriptionRepository;

    @Mock
    private PolicyService policyService;

    @Mock
    private CurrentUserService currentUser;

    @InjectMocks
    private PolicySubscriptionServiceImp service;

    private UUID customerId;
    private UUID agentId;
    private UUID subscriptionId;

    private Policy policy;
    private PolicySubscription subscription;

    @BeforeEach
    void setUp() {

        customerId = UUID.randomUUID();
        agentId = UUID.randomUUID();
        subscriptionId = UUID.randomUUID();

        policy = new Policy();
        policy.setId(1L);
        policy.setCoverageDuration(Period.ofMonths(12));
        policy.setPremiumsDuration(Period.ofMonths(12));

        subscription = new PolicySubscription();
        subscription.setId(subscriptionId);
        subscription.setCustomerId(customerId);
        subscription.setPolicyId(policy.getId());
        subscription.setStatus(SubscriptionStatus.PENDING);
    }

    @Test
    void shouldReturnSubscriptionById() {

        when(subscriptionRepository.findById(subscriptionId))
                .thenReturn(Optional.of(subscription));

        PolicySubscription result = service.getSubscriptionById(subscriptionId);

        assertSame(subscription, result);

        verify(subscriptionRepository).findById(subscriptionId);
    }

    @Test
    void shouldThrowWhenSubscriptionNotFound() {

        when(subscriptionRepository.findById(subscriptionId))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> service.getSubscriptionById(subscriptionId));

        verify(subscriptionRepository).findById(subscriptionId);
    }

    @Test
    void shouldReturnSubscriptionsByCustomer() {

        when(subscriptionRepository.findAllByCustomerId(customerId))
                .thenReturn(List.of(subscription));

        List<PolicySubscription> result =
                service.getAllSubscriptionsByCustomer(customerId);

        assertEquals(1, result.size());

        verify(subscriptionRepository).findAllByCustomerId(customerId);
    }

    @Test
    void shouldReturnAllSubscriptions() {

        when(subscriptionRepository.findAll())
                .thenReturn(List.of(subscription));

        List<PolicySubscription> result =
                service.getAllPolicySubscriptions();

        assertEquals(1, result.size());

        verify(subscriptionRepository).findAll();
    }

    @Test
    void shouldReturnSubscriptionsByPolicy() {

        when(subscriptionRepository.findAllByPolicyId(policy.getId()))
                .thenReturn(List.of(subscription));

        List<PolicySubscription> result =
                service.getAllSubscriptionsByPolicyId(policy.getId());

        assertEquals(1, result.size());

        verify(subscriptionRepository).findAllByPolicyId(policy.getId());
    }

    @Test
    void shouldReturnSubscriptionsBetweenDates() {

        LocalDate start = LocalDate.now();
        LocalDate end = start.plusDays(30);

        when(subscriptionRepository.findAllByCreatedAtBetween(start, end))
                .thenReturn(List.of(subscription));

        List<PolicySubscription> result =
                service.getAllSubscriptionsBetween(start, end);

        assertEquals(1, result.size());

        verify(subscriptionRepository)
                .findAllByCreatedAtBetween(start, end);
    }

    @Test
    void shouldReturnSubscriptionsByPolicyBetweenDates() {

        LocalDate start = LocalDate.now();
        LocalDate end = start.plusDays(30);

        when(subscriptionRepository.findAllByPolicyIdAndCreatedAtBetween(policy.getId(), start, end))
                .thenReturn(List.of(subscription));

        List<PolicySubscription> result =
                service.getAllPolicySubscriptionsBetween(policy.getId(), start, end);

        assertEquals(1, result.size());

        verify(subscriptionRepository)
                .findAllByPolicyIdAndCreatedAtBetween(policy.getId(), start, end);
    }

    @Test
    void shouldReturnSubscriptionsByStatus() {

        when(subscriptionRepository.findAllByStatus(SubscriptionStatus.ACTIVE))
                .thenReturn(List.of(subscription));

        List<PolicySubscription> result =
                service.getAllSubscriptionsByStatus(SubscriptionStatus.ACTIVE);

        assertEquals(1, result.size());

        verify(subscriptionRepository)
                .findAllByStatus(SubscriptionStatus.ACTIVE);
    }

    @Test
    void shouldCreateSubscription() {

        LocalDate startDate = LocalDate.of(2026, 1, 1);

        PolicySubscriptionRequestDto request =
                new PolicySubscriptionRequestDto(
                        customerId,
                        1L,
                        1000,
                        startDate);

        when(currentUser.userId()).thenReturn(agentId);
        when(policyService.getPolicyById(1L)).thenReturn(policy);

        when(subscriptionRepository.save(any(PolicySubscription.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        PolicySubscription result = service.createSubscription(request);

        assertEquals(agentId, result.getAgentId());
        assertEquals(policy.getId(), result.getPolicyId());
        assertEquals(startDate, result.getStartDate());
        assertEquals(startDate.plusMonths(12), result.getExpiry());
        assertEquals(startDate.plusMonths(12), result.getEndDate());

        assertEquals(12, result.getPayments().size());

        PremiumPayment first = result.getPayments().get(0);
        assertEquals(customerId, first.getCustomerId());
        assertEquals(startDate, first.getDueDate());
        assertEquals(1000, first.getPremiumAmount());

        verify(subscriptionRepository).save(any(PolicySubscription.class));
    }

    @Test
    void shouldActivateSubscription() {

        subscription.setCustomerId(customerId);

        UpdateSubscriptionDto request =
                new UpdateSubscriptionDto(subscriptionId);

        when(subscriptionRepository.findById(subscriptionId))
                .thenReturn(Optional.of(subscription));

        when(currentUser.userId()).thenReturn(customerId);

        when(subscriptionRepository.save(subscription))
                .thenReturn(subscription);

        PolicySubscription result = service.updateSubscription(request);

        assertEquals(SubscriptionStatus.ACTIVE, result.getStatus());
        assertTrue(result.getAcceptanceTime() != null);

        verify(subscriptionRepository).save(subscription);
    }

    @Test
    void shouldThrowWhenUpdatingOtherUsersSubscription() {

        UpdateSubscriptionDto request =
                new UpdateSubscriptionDto(subscriptionId);

        when(subscriptionRepository.findById(subscriptionId))
                .thenReturn(Optional.of(subscription));

        when(currentUser.userId()).thenReturn(UUID.randomUUID());

        assertThrows(SubscriptionNotFound.class,
                () -> service.updateSubscription(request));
    }
}