package com.ims.policies.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Period;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.ims.policies.dto.APIResponseDto;
import com.ims.policies.dto.CreatePolicyRequestDto;
import com.ims.policies.dto.PolicyRequestDto;
import com.ims.policies.dto.PolicyResponseDto;
import com.ims.policies.enums.PolicyStatus;
import com.ims.policies.enums.PolicyType;
import com.ims.policies.models.Policy;
import com.ims.policies.service.PolicyService;

class PolicyControllerTest {

    private PolicyService policyService;
    private PolicyController controller;

    private Policy policy;
    private PolicyResponseDto responseDto;

    private CreatePolicyRequestDto createRequest;
    private PolicyRequestDto updateRequest;

    @BeforeEach
    void setUp() {

        policyService = Mockito.mock(PolicyService.class);

        controller = new PolicyController(policyService);

        policy = new Policy();
        policy.setId(1L);
        policy.setPolicyId("POLICY-0001");

        createRequest = new CreatePolicyRequestDto(
                PolicyType.HEALTH,
                "Health Insurance",
                500000,
                Period.ofYears(5),
                Period.ofYears(5),
                10L);

        updateRequest = new PolicyRequestDto(
                1L,
                PolicyType.HEALTH,
                "Updated Policy",
                750000,
                Period.ofYears(10),
                Period.ofYears(10),
                10L);

        responseDto = PolicyResponseDto.builder()
                .id(1L)
                .policyId("POLICY-0001")
                .policyType(PolicyType.HEALTH)
                .description("Health Insurance")
                .coverageAmount(500000)
                .coverageDuration(Period.ofYears(5))
                .premiumsDuration(Period.ofYears(5))
                .status(PolicyStatus.ACTIVE)
                .document(null)
                .build();
    }

    @Test
    void shouldReturnAllPolicies() {

        when(policyService.getAllPolicies())
                .thenReturn(List.of(responseDto));

        APIResponseDto body =
                controller.getAllPolicies().getBody();

        assertNotNull(body);
        assertEquals(List.of(responseDto), body.getBody());

        verify(policyService).getAllPolicies();
    }

    @Test
    void shouldReturnPoliciesByIds() {

        List<Long> ids = List.of(1L, 2L);

        when(policyService.getAllPoliciesByIds(ids))
                .thenReturn(List.of(policy));

        APIResponseDto body =
                controller.getAllPoliciesByIds(ids).getBody();

        assertNotNull(body);
        assertEquals(List.of(policy), body.getBody());

        verify(policyService).getAllPoliciesByIds(ids);
    }

    @Test
    void shouldReturnPolicyById() {

        when(policyService.getPolicyById(1L))
                .thenReturn(policy);

        APIResponseDto body =
                controller.getPolicyById(1L).getBody();

        assertNotNull(body);
        assertEquals(policy, body.getBody());

        verify(policyService).getPolicyById(1L);
    }

    @Test
    void shouldReturnPolicyByPolicyId() {

        when(policyService.getPolicyByPolicyId("POLICY-0001"))
                .thenReturn(responseDto);

        APIResponseDto body =
                controller.getPolicyById("POLICY-0001").getBody();

        assertNotNull(body);
        assertEquals(responseDto, body.getBody());

        verify(policyService).getPolicyByPolicyId("POLICY-0001");
    }

    @Test
    void shouldCreatePolicy() {

        when(policyService.createPolicy(createRequest))
                .thenReturn(responseDto);

        APIResponseDto body =
                controller.cretaePolicy(createRequest).getBody();

        assertNotNull(body);
        assertEquals(responseDto, body.getBody());

        verify(policyService).createPolicy(createRequest);
    }

    @Test
    void shouldUpdatePolicy() {

        when(policyService.updatePolicy(updateRequest))
                .thenReturn(responseDto);

        APIResponseDto body =
                controller.updatePolicy(updateRequest).getBody();

        assertNotNull(body);
        assertEquals(responseDto, body.getBody());

        verify(policyService).updatePolicy(updateRequest);
    }

    @Test
    void shouldDeletePolicy() {

        when(policyService.deletePolicy(updateRequest))
                .thenReturn(true);

        APIResponseDto body =
                controller.deletePolicy(updateRequest).getBody();

        assertNotNull(body);
        assertEquals(true, body.getBody());

        verify(policyService).deletePolicy(updateRequest);
    }
}