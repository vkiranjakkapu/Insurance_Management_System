package com.ims.premiums.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ims.premiums.dto.APIResponseDto;
import com.ims.premiums.dto.PolicySubscriptionRequestDto;
import com.ims.premiums.dto.UpdateSubscriptionDto;
import com.ims.premiums.models.PolicySubscription;
import com.ims.premiums.service.CurrentUserService;
import com.ims.premiums.service.PolicySubscriptionService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/v1/policies/subscriptions")
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
    @PreAuthorize("hasAnyRole('ADMIN','CUSTOMER')")
    public ResponseEntity<APIResponseDto> getAllSubscriptions() {
        List<PolicySubscription> allPolicySubscriptions;
        if (currentUser.isCustomer())
            allPolicySubscriptions = subscriptionService.getAllSubscriptionsByCustomer(currentUser.userId());
        else
            allPolicySubscriptions = subscriptionService.getAllPolicySubscriptions();
        return ResponseEntity.ok(APIResponseDto.builder().body(allPolicySubscriptions).build());
    }

    @Operation(summary = "Accept subscription/purchase")
    @PatchMapping("/")
    @PreAuthorize("hasAnyRole('CUSTOMER')")
    public ResponseEntity<APIResponseDto> acceptSubscription(@RequestBody UpdateSubscriptionDto request) {
        return ResponseEntity
                .ok(APIResponseDto.builder().body(subscriptionService.updateSubscription(request)).build());
    }

    @Operation(summary = "Make policy subscription/purchase")
    @PostMapping("/")
    @PreAuthorize("hasAnyRole('ADMIN','AGENT')")
    public ResponseEntity<APIResponseDto> subscribeToPolicy(@RequestBody PolicySubscriptionRequestDto request) {
        return ResponseEntity
                .ok(APIResponseDto.builder().body(subscriptionService.createSubscription(request)).build());
    }

}
