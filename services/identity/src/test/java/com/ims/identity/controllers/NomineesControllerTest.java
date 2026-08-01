package com.ims.identity.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.ims.identity.dto.APIResponseDto;
import com.ims.identity.dto.NomineeCreationRequestDto;
import com.ims.identity.dto.NomineeRequestDto;
import com.ims.identity.dto.NomineeResponseDto;
import com.ims.identity.entities.Nominee;
import com.ims.identity.enums.RelationshipType;
import com.ims.identity.services.NomineeService;

@ExtendWith(MockitoExtension.class)
class NomineesControllerTest {

    @Mock
    private NomineeService nomineeService;

    @InjectMocks
    private NomineesController controller;

    private Nominee nominee;
    private UUID customerId;

    @BeforeEach
    void setUp() {

        customerId = UUID.randomUUID();

        nominee = new Nominee();
        nominee.setId(1L);
        nominee.setName("John Doe");
        nominee.setEmail("john@test.com");
        nominee.setPhone("9999999999");
        nominee.setRelationship(RelationshipType.SPOUSE);
    }

    @Test
    void shouldGetNomineeById() {

        when(nomineeService.getNomineeById(1L))
                .thenReturn(nominee);

        ResponseEntity<APIResponseDto> response =
                controller.getNomineeById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(nominee, response.getBody().getBody());

        verify(nomineeService).getNomineeById(1L);
    }

    @Test
    void shouldGetAllNomineesByCustomer() {

        List<Nominee> nominees = List.of(nominee);

        when(nomineeService.getAllNomineesByCustomer(customerId))
                .thenReturn(nominees);

        ResponseEntity<APIResponseDto> response =
                controller.getAllNomineesByCustomer(customerId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());

        @SuppressWarnings("unchecked")
        List<Nominee> body =
                (List<Nominee>) response.getBody().getBody();

        assertEquals(1, body.size());

        verify(nomineeService).getAllNomineesByCustomer(customerId);
    }

    @Test
    void shouldCreateNominees() {

        NomineeRequestDto nomineeRequest =
                NomineeRequestDto.builder()
                        .name("John Doe")
                        .email("john@test.com")
                        .phone("9999999999")
                        .relationship(RelationshipType.SPOUSE)
                        .build();

        NomineeCreationRequestDto request =
                NomineeCreationRequestDto.builder()
                        .nominees(List.of(nomineeRequest))
                        .build();

        NomineeResponseDto responseDto =
                NomineeResponseDto.builder()
                        .id(1L)
                        .name("John Doe")
                        .email("john@test.com")
                        .phone("9999999999")
                        .relationship(RelationshipType.SPOUSE)
                        .build();

        when(nomineeService.createAllNominees(request.nominees()))
                .thenReturn(List.of(responseDto));

        ResponseEntity<APIResponseDto> response =
                controller.createNominee(request);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());

        @SuppressWarnings("unchecked")
        List<NomineeResponseDto> body =
                (List<NomineeResponseDto>) response.getBody().getBody();

        assertEquals(1, body.size());

        verify(nomineeService)
                .createAllNominees(request.nominees());
    }

    @Test
    void shouldDeleteNominee() {

        when(nomineeService.getNomineeById(1L))
                .thenReturn(nominee);

        when(nomineeService.deleteNominee(nominee))
                .thenReturn(true);

        ResponseEntity<APIResponseDto> response =
                controller.deleteNominee(1L);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(true, response.getBody().getBody());

        verify(nomineeService).getNomineeById(1L);
        verify(nomineeService).deleteNominee(nominee);
    }

}