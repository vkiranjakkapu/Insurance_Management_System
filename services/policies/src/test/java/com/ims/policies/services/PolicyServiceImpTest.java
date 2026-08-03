package com.ims.policies.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Period;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.ims.policies.dto.CreatePolicyRequestDto;
import com.ims.policies.dto.PolicyRequestDto;
import com.ims.policies.dto.PolicyResponseDto;
import com.ims.policies.enums.PolicyStatus;
import com.ims.policies.enums.PolicyType;
import com.ims.policies.exception.ResourceNotFoundException;
import com.ims.policies.models.Document;
import com.ims.policies.models.Policy;
import com.ims.policies.repository.PolicyRepository;
import com.ims.policies.service.DocumentService;
import com.ims.policies.service.imp.PolicyServiceImp;

@ExtendWith(MockitoExtension.class)
class PolicyServiceImpTest {

    @Mock
    private PolicyRepository policyRepository;

    @Mock
    private DocumentService documentService;

    @InjectMocks
    private PolicyServiceImp service;

    private Document document;
    private Policy policy;

    private CreatePolicyRequestDto createRequest;
    private PolicyRequestDto updateRequest;

    @BeforeEach
    void setUp() {

        document = new Document();
        document.setId(10L);

        policy = new Policy();
        policy.setId(1L);
        policy.setPolicyId("POLICY-0001");
        policy.setPolicyType(PolicyType.HEALTH);
        policy.setDescription("Health Policy");
        policy.setCoverageAmount(500000);
        policy.setCoverageDuration(Period.ofYears(5));
        policy.setPremiumsDuration(Period.ofYears(5));
        policy.setStatus(PolicyStatus.ACTIVE);
        policy.setLatest(true);
        policy.setDocument(10L);

        createRequest = new CreatePolicyRequestDto(
                PolicyType.HEALTH,
                "Health Policy",
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
    }

    @Test
    void shouldReturnAllPolicies() {

        when(policyRepository.findAllByIsLatestTrue())
                .thenReturn(List.of(policy));

        when(documentService.getPolicyDocumentById(10L))
                .thenReturn(document);

        List<PolicyResponseDto> result = service.getAllPolicies();

        assertEquals(1, result.size());
        assertEquals(policy.getPolicyId(), result.getFirst().policyId());

        verify(policyRepository).findAllByIsLatestTrue();
        verify(documentService).getPolicyDocumentById(10L);
    }

    @Test
    void shouldReturnPoliciesByStatus() {

        when(policyRepository.findAllByStatusAndIsLatestTrue(PolicyStatus.ACTIVE))
                .thenReturn(List.of(policy));

        List<Policy> result = service.getAllPoliciesByStatus(PolicyStatus.ACTIVE);

        assertEquals(1, result.size());

        verify(policyRepository)
                .findAllByStatusAndIsLatestTrue(PolicyStatus.ACTIVE);
    }

    @Test
    void shouldReturnPoliciesByIds() {

        when(policyRepository.findAllById(List.of(1L)))
                .thenReturn(List.of(policy));

        List<Policy> result = service.getAllPoliciesByIds(List.of(1L));

        assertEquals(1, result.size());

        verify(policyRepository).findAllById(List.of(1L));
    }

    @Test
    void shouldReturnPolicyById() {

        when(policyRepository.findById(1L))
                .thenReturn(Optional.of(policy));

        Policy result = service.getPolicyById(1L);

        assertSame(policy, result);

        verify(policyRepository).findById(1L);
    }

    @Test
    void shouldThrowWhenPolicyNotFound() {

        when(policyRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> service.getPolicyById(1L));

        verify(policyRepository).findById(1L);
    }

    @Test
    void shouldReturnPolicyByPolicyId() {

        when(policyRepository.findByPolicyIdAndIsLatestTrue("POLICY-0001"))
                .thenReturn(Optional.of(policy));

        when(documentService.getPolicyDocumentById(10L))
                .thenReturn(document);

        PolicyResponseDto result = service.getPolicyByPolicyId("POLICY-0001");

        assertEquals("POLICY-0001", result.policyId());

        verify(policyRepository).findByPolicyIdAndIsLatestTrue("POLICY-0001");
        verify(documentService).getPolicyDocumentById(10L);
    }

    @Test
    void shouldCreatePolicy() {

        when(documentService.getPolicyDocumentById(10L))
                .thenReturn(document);

        when(policyRepository.getNextPolicyIdSequence())
                .thenReturn(1L);

        when(policyRepository.save(any(Policy.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        PolicyResponseDto result = service.createPolicy(createRequest);

        assertNotNull(result);
        assertEquals("POLICY-0001", result.policyId());
        assertEquals(PolicyType.HEALTH, result.policyType());

        verify(documentService).getPolicyDocumentById(10L);
        verify(policyRepository).getNextPolicyIdSequence();
        verify(policyRepository).save(any(Policy.class));
    }

    @Test
    void shouldUpdatePolicy() {

        when(policyRepository.findById(1L))
                .thenReturn(Optional.of(policy));

        when(documentService.getPolicyDocumentById(10L))
                .thenReturn(document);

        when(policyRepository.saveAll(any()))
                .thenAnswer(invocation -> invocation.getArgument(0));

        PolicyResponseDto result = service.updatePolicy(updateRequest);

        assertNotNull(result);
        assertEquals("POLICY-0001", result.policyId());
        assertEquals(PolicyType.HEALTH, result.policyType());

        assertEquals(PolicyStatus.TERMINATED, policy.getStatus());
        assertTrue(!policy.isLatest());

        verify(policyRepository).findById(1L);
        verify(documentService).getPolicyDocumentById(10L);
        verify(policyRepository).saveAll(any());
    }

    @Test
    void shouldDeletePolicy() {

        when(policyRepository.findById(1L))
                .thenReturn(Optional.of(policy));

        when(policyRepository.save(policy))
                .thenReturn(policy);

        boolean result = service.deletePolicy(updateRequest);

        assertTrue(result);
        assertEquals(PolicyStatus.TERMINATED, policy.getStatus());

        verify(policyRepository).save(policy);
    }
}