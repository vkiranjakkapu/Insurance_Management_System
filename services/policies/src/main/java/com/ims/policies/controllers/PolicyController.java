package com.ims.policies.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ims.policies.dto.APIResponseDto;
import com.ims.policies.dto.CreatePolicyRequestDto;
import com.ims.policies.dto.PolicyRequestDto;
import com.ims.policies.service.PolicyService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("policies/api/v1/policies")
public class PolicyController {

    private PolicyService policyService;

    PolicyController(PolicyService policyService) {
        this.policyService = policyService;
    }

    @Operation(summary = "Get all policies")
    @GetMapping("/")
    public ResponseEntity<APIResponseDto> getAllPolicies() {
        return ResponseEntity.ok(APIResponseDto.builder().body(policyService.getAllPolicies()).build());
    }

    @Operation(summary = "Get policy by id")
    @GetMapping("/{id}")
    public ResponseEntity<APIResponseDto> getPolicyById(@PathVariable Long id) {
        return ResponseEntity.ok(APIResponseDto.builder().body(policyService.getPolicyById(id)).build());
    }

    @Operation(summary = "Create new policy")
    @PostMapping("/")
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT')")
    public ResponseEntity<APIResponseDto> cretaePolicy(@RequestBody CreatePolicyRequestDto request) {
        return ResponseEntity.ok(APIResponseDto.builder().body(policyService.createPolicy(request)).build());
    }

    @Operation(summary = "Update existing policy")
    @PutMapping("/")
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT')")
    public ResponseEntity<APIResponseDto> updatePolicy(@RequestBody PolicyRequestDto request) {
        return ResponseEntity.ok(APIResponseDto.builder().body(policyService.updatePolicy(request)).build());
    }

    @Operation(summary = "Terminate policy")
    @DeleteMapping("/")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<APIResponseDto> deletePolicy(@RequestBody PolicyRequestDto request) {
        return ResponseEntity.ok(APIResponseDto.builder().body(policyService.deletePolicy(request)).build());
    }

}
