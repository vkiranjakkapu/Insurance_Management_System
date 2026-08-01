package com.ims.identity.services.imp;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.ims.identity.dto.NomineeRequestDto;
import com.ims.identity.dto.NomineeResponseDto;
import com.ims.identity.entities.Nominee;
import com.ims.identity.entities.User;
import com.ims.identity.enums.RelationshipType;
import com.ims.identity.exceptions.ResourceNotFoundException;
import com.ims.identity.repository.NomineeRepository;

@ExtendWith(MockitoExtension.class)
class NomineeServiceImpTest {

    @Mock
    private NomineeRepository nomineeRepository;

    @InjectMocks
    private NomineeServiceImp nomineeService;

    private UUID customerId;
    private Nominee nominee;
    private NomineeRequestDto request;

    @BeforeEach
    void setUp() {

        customerId = UUID.randomUUID();

        nominee = Nominee.builder()
                .id(1L)
                .name("John Doe")
                .email("john@test.com")
                .phone("9999999999")
                .relationship(RelationshipType.SPOUSE)
                .customer(User.builder().id(customerId).build())
                .build();

        request = NomineeRequestDto.builder()
                .customerId(customerId)
                .name("John Doe")
                .email("john@test.com")
                .phone("9999999999")
                .relationship(RelationshipType.SPOUSE)
                .build();
    }

    @Test
    void shouldGetAllNomineesByCustomer() {

        when(nomineeRepository.findAllByPolicyHolder(any(User.class)))
                .thenReturn(List.of(nominee));

        List<Nominee> response = nomineeService.getAllNomineesByCustomer(customerId);

        assertEquals(1, response.size());
        assertEquals(nominee, response.getFirst());

        verify(nomineeRepository).findAllByPolicyHolder(any(User.class));
    }

    @Test
    void shouldGetNomineeById() {

        when(nomineeRepository.findById(1L))
                .thenReturn(Optional.of(nominee));

        Nominee response = nomineeService.getNomineeById(1L);

        assertEquals(nominee, response);

        verify(nomineeRepository).findById(1L);
    }

    @Test
    void shouldThrowWhenNomineeNotFound() {

        when(nomineeRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> nomineeService.getNomineeById(1L));

        verify(nomineeRepository).findById(1L);
    }

    @Test
    void shouldCreateAllNominees() {

        when(nomineeRepository.saveAll(any()))
                .thenReturn(List.of(nominee));

        List<NomineeResponseDto> response =
                nomineeService.createAllNominees(List.of(request));

        assertEquals(1, response.size());

        NomineeResponseDto dto = response.getFirst();

        assertEquals(nominee.getId(), dto.id());
        assertEquals(nominee.getName(), dto.name());
        assertEquals(nominee.getEmail(), dto.email());
        assertEquals(nominee.getPhone(), dto.phone());
        assertEquals(nominee.getRelationship(), dto.relationship());

        verify(nomineeRepository).saveAll(any());
    }

    @Test
    void shouldUpdateNominee() {

        when(nomineeRepository.save(nominee))
                .thenReturn(nominee);

        Nominee response = nomineeService.updateNominee(nominee);

        assertEquals(nominee, response);

        verify(nomineeRepository).save(nominee);
    }

    @Test
    void shouldDeleteNominee() {

        boolean deleted = nomineeService.deleteNominee(nominee);

        assertTrue(deleted);

        verify(nomineeRepository).delete(nominee);
    }
}