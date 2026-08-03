package com.ims.policies.service.imp;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ims.policies.dto.CreatePolicyRequestDto;
import com.ims.policies.dto.PolicyRequestDto;
import com.ims.policies.dto.PolicyResponseDto;
import com.ims.policies.enums.PolicyStatus;
import com.ims.policies.exception.ResourceNotFoundException;
import com.ims.policies.models.Policy;
import com.ims.policies.repository.PolicyRepository;
import com.ims.policies.service.DocumentService;
import com.ims.policies.service.PolicyService;

@Service
@Transactional
public class PolicyServiceImp implements PolicyService {

    private PolicyRepository policyRepository;
    private DocumentService documentService;

    public PolicyServiceImp(PolicyRepository policyRepository,
            DocumentService documentService) {

        this.policyRepository = policyRepository;
        this.documentService = documentService;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Policy> getAllPolicies() {
        return policyRepository.findAllByIsLatestTrue().stream().map(pol -> {
            pol.setDoc(documentService.getPolicyDocumentById(pol.getDocument()));
            return pol;
        }).toList();
    }

    @Override
    public List<Policy> getAllPoliciesByIds(List<Long> policyIds) {
        List<Policy> allPolicies = policyRepository.findAllById(policyIds);
        return allPolicies;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Policy> getAllPoliciesByStatus(PolicyStatus status) {
        return policyRepository.findAllByStatusAndIsLatestTrue(status);
    }

    @Override
    @Transactional(readOnly = true)
    public Policy getPolicyById(Long id) {
        return policyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No Policy Found with Given ID."));
    }

    @Override
    @Transactional(readOnly = true)
    public Policy getPolicyByPolicyId(String id) {
        return policyRepository.findByPolicyId(id)
                .orElseThrow(() -> new ResourceNotFoundException("No Policy Found with Given ID."));
    }

    @Override
    @Transactional
    public PolicyResponseDto createPolicy(CreatePolicyRequestDto request) {

        Policy policy = new Policy();
        policy.setPolicyType(request.policyType());
        policy.setDescription(request.description());
        policy.setCoverageAmount(request.coverageAmount());
        policy.setCoverageDuration(request.coverageDuration());
        policy.setPremiumsDuration(request.premiumsDuration());
        policy.setDocument(documentService.getPolicyDocumentById(request.documentId()).getId());

        Policy newPolicy = policyRepository.save(policy);

        return preparePolicyRespoonse(newPolicy);
    }

    @Override
    @Transactional
    public PolicyResponseDto updatePolicy(PolicyRequestDto request) {

        Policy oldPolicy = getPolicyById(request.policyId());
        oldPolicy.setStatus(PolicyStatus.TERMINATED);
        oldPolicy.setLatest(false);

        Policy newPolicy = new Policy();
        newPolicy.setPolicyId(oldPolicy.getPolicyId());
        newPolicy.setDescription(request.description());
        newPolicy.setCoverageAmount(request.coverageAmount());
        newPolicy.setCoverageDuration(request.coverageDuration());
        newPolicy.setPremiumsDuration(request.premiumsDuration());
        newPolicy.setDocument(documentService.getPolicyDocumentById(request.documentId()).getId());
        newPolicy.setPolicyType(request.policyType());
        oldPolicy.setLatest(false);

        policyRepository.saveAll(List.of(newPolicy, oldPolicy));

        return preparePolicyRespoonse(newPolicy);
    }

    @Override
    @Transactional
    public boolean deletePolicy(PolicyRequestDto request) {

        Policy policy = getPolicyById(request.policyId());
        policy.setStatus(PolicyStatus.TERMINATED);
        policyRepository.save(policy);
        return true;

    }

    private PolicyResponseDto preparePolicyRespoonse(Policy policy) {
        return PolicyResponseDto.builder()
                .id(policy.getId())
                .policyId(policy.getPolicyId())
                .policyType(policy.getPolicyType())
                .description(policy.getDescription())
                .coverageAmount(policy.getCoverageAmount())
                .coverageDuration(policy.getCoverageDuration())
                .premiumsDuration(policy.getPremiumsDuration())
                .status(policy.getStatus())
                .build();
    }

}
