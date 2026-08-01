package com.ims.claims.models;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.ims.claims.enums.SubscriptionStatus;

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
public class PolicySubscription {

    private UUID id;

    private UUID customerId;

    private Policy policy;

    private LocalDate startDate;

    private LocalDate endDate;

    private LocalDate expiry;

    private List<PremiumPayment> payments;

    private SubscriptionStatus status;

    private LocalDateTime acceptanceTime;

    private UUID agentId;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @CreationTimestamp
    private LocalDateTime createdAt;

}