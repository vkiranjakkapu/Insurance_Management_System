package com.ims.policies.models;

import java.time.LocalDateTime;
import java.time.Period;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Generated;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.generator.EventType;

import com.ims.policies.enums.PolicyStatus;
import com.ims.policies.enums.PolicyType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "policies")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Policy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(insertable = false, updatable = false)
    @Generated(event = EventType.INSERT)
    private String policyId;

    @Enumerated(EnumType.STRING)
    private PolicyType policyType;

    private String description;

    private Integer coverageAmount;

    private Period coverageDuration;

    private Period premiumsDuration;

    @Enumerated(EnumType.STRING)
    private PolicyStatus status = PolicyStatus.ACTIVE;

    @Column(name = "document_id")
    private Long document;

    private boolean isLatest = true;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @Transient
    private Document doc;

}
