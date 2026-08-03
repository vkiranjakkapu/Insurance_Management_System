package com.ims.premiums.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ims.premiums.dto.APIResponseDto;
import com.ims.premiums.dto.PolicySubscriptionRequestDto;
import com.ims.premiums.dto.UpdateSubscriptionDto;
import com.ims.premiums.enums.SubscriptionStatus;
import com.ims.premiums.models.PolicySubscription;
import com.ims.premiums.service.CurrentUserService;
import com.ims.premiums.service.PolicySubscriptionService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/premiums/api/v1/subscriptions")
public class PolicySubscriptionsController {

    private PolicySubscriptionService subscriptionService;
    private CurrentUserService currentUser;

    PolicySubscriptionsController(PolicySubscriptionService subscriptionService,
            CurrentUserService currentUser) {

        this.subscriptionService = subscriptionService;
        this.currentUser = currentUser;
    }

    @Operation(summary = "Get all subscriptions")
    @GetMapping("/")
    @PreAuthorize("hasAnyRole('ADMIN','AGENT','CUSTOMER')")
    public ResponseEntity<APIResponseDto> getAllSubscriptions() {
        List<PolicySubscription> allPolicySubscriptions;
        if (currentUser.isCustomer()) {
            allPolicySubscriptions = subscriptionService.getAllSubscriptionsByCustomer(currentUser.userId());
        } else if (currentUser.isAgent()) {
            allPolicySubscriptions = subscriptionService.getAllSubscriptionsByAgent(currentUser.userId());
        } else {
            allPolicySubscriptions = subscriptionService.getAllPolicySubscriptions();
        }
        return ResponseEntity.ok(APIResponseDto.builder()
                .body(subscriptionService.getAllPolicySubscriptionsPrepared(allPolicySubscriptions)).build());
    }

    @Operation(summary = "Get subscription by ID")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','AGENT','CUSTOMER')")
    public ResponseEntity<APIResponseDto> getSubscriptionById(@PathVariable UUID id) {
        return ResponseEntity.ok(APIResponseDto.builder()
                .body(subscriptionService.getSubscriptionResponse(id)).build());
    }

    @Operation(summary = "Get all subscriptions by status")
    @GetMapping("/search/{status}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<APIResponseDto> getAllSubscriptionsByStatus(@PathVariable SubscriptionStatus status) {
        List<PolicySubscription> allPolicySubscriptions;
        allPolicySubscriptions = subscriptionService.getAllSubscriptionsByStatus(status);
        return ResponseEntity.ok(APIResponseDto.builder()
                .body(subscriptionService.getAllPolicySubscriptionsPrepared(allPolicySubscriptions)).build());
    }

    @Operation(summary = "Accept subscription/purchase")
    @PatchMapping("/")
    @PreAuthorize("hasAnyRole('CUSTOMER')")
    public ResponseEntity<APIResponseDto> acceptSubscription(@RequestBody UpdateSubscriptionDto request) {
        return ResponseEntity
                .ok(APIResponseDto.builder()
                        .body(subscriptionService
                                .getSubscriptionResponse(subscriptionService.updateSubscription(request).getId()))
                        .build());
    }

    @Operation(summary = "Make policy subscription/purchase")
    @PostMapping("/")
    @PreAuthorize("hasAnyRole('ADMIN','AGENT')")
    public ResponseEntity<APIResponseDto> subscribeToPolicy(@RequestBody PolicySubscriptionRequestDto request) {
        return ResponseEntity
                .ok(APIResponseDto.builder().body(subscriptionService.createSubscription(request)).build());
    }

}
