package com.ims.premiums.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ims.premiums.dto.APIResponseDto;
import com.ims.premiums.models.PremiumPayment;
import com.ims.premiums.service.CurrentUserService;
import com.ims.premiums.service.PaymentsService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/premiums/api/v1/")
public class PaymentsController {

    private PaymentsService paymentsService;
    private CurrentUserService currentUser;

    PaymentsController(PaymentsService paymentsService,
            CurrentUserService currentUser) {

        this.paymentsService = paymentsService;
        this.currentUser = currentUser;
    }

    @Operation(summary = "Get all payments")
    @GetMapping("/")
    @PreAuthorize("hasRole('ADMIN','CUSTOMER')")
    public ResponseEntity<APIResponseDto> getAllPayments() {

        List<PremiumPayment> allPremiumPayments;
        if (currentUser.isAdmin())
            allPremiumPayments = paymentsService.getAllPremiumPayments();
        else
            allPremiumPayments = paymentsService.getAllPremiumPaymentsByCustomer(currentUser.userId());

        return ResponseEntity.ok(APIResponseDto.builder().body(allPremiumPayments).build());
    }

    @Operation(summary = "Get all payments by subcription ID")
    @GetMapping("/{id}")
    public ResponseEntity<APIResponseDto> getAllPaymentsBySubscription(@PathVariable UUID subscriptionId) {
        return ResponseEntity.ok(APIResponseDto.builder()
                .body(APIResponseDto.builder().body(paymentsService.getAllPremiumPaymentsBySubscription(subscriptionId))
                        .build())
                .build());
    }

    @Operation(summary = "Pay premium with ID")
    @PostMapping("/{id}")
    public ResponseEntity<APIResponseDto> payPremium(@PathVariable UUID paymentId) {
        return ResponseEntity.ok(APIResponseDto.builder()
                .body(APIResponseDto.builder().body(paymentsService.payPremium(paymentId)).build()).build());
    }

}
