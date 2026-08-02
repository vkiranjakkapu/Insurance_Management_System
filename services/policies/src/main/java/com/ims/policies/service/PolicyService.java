package com.ims.policies.service;

import java.util.List;

import com.ims.policies.dto.CreatePolicyRequestDto;
import com.ims.policies.dto.PolicyRequestDto;
import com.ims.policies.dto.PolicyResponseDto;
import com.ims.policies.enums.PolicyStatus;
import com.ims.policies.models.Policy;

public interface PolicyService {

    List<Policy> getAllPolicies();

    List<Policy> getAllPoliciesByStatus(PolicyStatus status);

    List<Policy> getAllPoliciesByIds(List<Long> policyIds);

    Policy getPolicyById(Long id);

    PolicyResponseDto createPolicy(CreatePolicyRequestDto request);

    PolicyResponseDto updatePolicy(PolicyRequestDto request);

    boolean deletePolicy(PolicyRequestDto request);

}