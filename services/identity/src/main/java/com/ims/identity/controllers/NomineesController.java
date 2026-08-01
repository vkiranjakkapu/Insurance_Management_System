package com.ims.identity.controllers;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ims.identity.dto.APIResponseDto;
import com.ims.identity.dto.NomineeCreationRequestDto;
import com.ims.identity.services.NomineeService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/identity/api/v1/nominees")
@RequiredArgsConstructor
public class NomineesController {

    private final NomineeService nomineeService;

    @GetMapping("/{nomineeId}")
    public ResponseEntity<APIResponseDto> getNomineeById(@PathVariable Long nomineeId) {
        return ResponseEntity.ok()
                .body(APIResponseDto.builder().body(nomineeService.getNomineeById(nomineeId)).build());
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<APIResponseDto> getAllNomineesByCustomer(@PathVariable UUID customerId) {
        return ResponseEntity.ok()
                .body(APIResponseDto.builder().body(nomineeService.getAllNomineesByCustomer(customerId)).build());
    }

    @PostMapping("/")
    public ResponseEntity<APIResponseDto> createNominee(@Valid @RequestBody NomineeCreationRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(APIResponseDto.builder().body(nomineeService.createAllNominees(request.nominees())).build());
    }

    @DeleteMapping("/{nomineeId}")
    public ResponseEntity<APIResponseDto> deleteNominee(@PathVariable Long nomineeId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(APIResponseDto.builder()
                        .body(nomineeService.deleteNominee(nomineeService.getNomineeById(nomineeId))).build());
    }

}
