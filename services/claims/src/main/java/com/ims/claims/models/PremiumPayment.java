package com.ims.claims.models;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import com.ims.claims.enums.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PremiumPayment {

    private UUID id;

    private PolicySubscription subscription;

    private UUID customerId;

    private String method;

    private Integer amountPayed;

    private Integer premiumAmount;

    private PaymentStatus status;

    private LocalDate dueDate;

    private LocalDateTime paymentTime;

    private LocalDateTime createdAt;

}
