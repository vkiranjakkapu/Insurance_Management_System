package com.ims.policies.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import com.ims.premiums.controllers.PolicySubscriptionsController;
import com.ims.premiums.dto.APIResponseDto;
import com.ims.premiums.dto.PolicySubscriptionRequestDto;
import com.ims.premiums.dto.UpdateSubscriptionDto;
import com.ims.premiums.models.PolicySubscription;
import com.ims.premiums.service.CurrentUserService;
import com.ims.premiums.service.PolicySubscriptionService;

@ExtendWith(MockitoExtension.class)
class PolicySubscriptionsControllerTest {

    @Mock
    private PolicySubscriptionService subscriptionService;

    @Mock
    private CurrentUserService currentUser;

    @InjectMocks
    private PolicySubscriptionsController controller;

    private UUID customerId;
    private PolicySubscription subscription;
    private PolicySubscriptionRequestDto subscriptionRequest;
    private UpdateSubscriptionDto updateRequest;

    @BeforeEach
    void setUp() {

        customerId = UUID.randomUUID();

        subscription = new PolicySubscription();

        subscriptionRequest = new PolicySubscriptionRequestDto(
                customerId,
                1L,
                5000,
                LocalDate.now());

        updateRequest = new UpdateSubscriptionDto(
                UUID.randomUUID());
    }

    @Test
    void shouldGetAllSubscriptionsForCustomer() {

        List<PolicySubscription> subscriptions = List.of(subscription);

        when(currentUser.isCustomer()).thenReturn(true);
        when(currentUser.userId()).thenReturn(customerId);
        when(subscriptionService.getAllSubscriptionsByCustomer(customerId)).thenReturn(subscriptions);

        ResponseEntity<APIResponseDto> response = controller.getAllSubscriptions();

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals(subscriptions, response.getBody().getBody());

        verify(currentUser).isCustomer();
        verify(currentUser).userId();
        verify(subscriptionService).getAllSubscriptionsByCustomer(customerId);
    }

    @Test
    void shouldGetAllSubscriptionsForAdmin() {

        List<PolicySubscription> subscriptions = List.of(subscription);

        when(currentUser.isCustomer()).thenReturn(false);
        when(subscriptionService.getAllPolicySubscriptions()).thenReturn(subscriptions);

        ResponseEntity<APIResponseDto> response = controller.getAllSubscriptions();

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals(subscriptions, response.getBody().getBody());

        verify(currentUser).isCustomer();
        verify(subscriptionService).getAllPolicySubscriptions();
    }

    @Test
    void shouldAcceptSubscription() {

        when(subscriptionService.updateSubscription(updateRequest)).thenReturn(subscription);

        ResponseEntity<APIResponseDto> response = controller.acceptSubscription(updateRequest);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals(subscription, response.getBody().getBody());

        verify(subscriptionService).updateSubscription(updateRequest);
    }

    @Test
    void shouldSubscribeToPolicy() {

        when(subscriptionService.createSubscription(subscriptionRequest)).thenReturn(subscription);

        ResponseEntity<APIResponseDto> response = controller.subscribeToPolicy(subscriptionRequest);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals(subscription, response.getBody().getBody());

        verify(subscriptionService).createSubscription(subscriptionRequest);
    }
}