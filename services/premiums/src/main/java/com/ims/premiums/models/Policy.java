package com.ims.premiums.models;

import java.time.LocalDateTime;
import java.time.Period;

import com.ims.premiums.enums.PolicyStatus;
import com.ims.premiums.enums.PolicyType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Policy {

    private Long id;

    private String policyId;

    private PolicyType policyType;

    private String description;

    private Integer coverageAmount;

    private Period coverageDuration;

    private Period premiumsDuration;

    private PolicyStatus status;

    private Long document;

    private boolean isLatest = true;

    private LocalDateTime updatedAt;

    private LocalDateTime createdAt;

}
