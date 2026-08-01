package com.ims.identity.services;

import java.util.List;
import java.util.UUID;

import com.ims.identity.dto.NomineeRequestDto;
import com.ims.identity.dto.NomineeResponseDto;
import com.ims.identity.entities.Nominee;

public interface NomineeService {

    List<Nominee> getAllNomineesByCustomer(UUID customerId);

    Nominee getNomineeById(Long id);

    List<NomineeResponseDto> createAllNominees(List<NomineeRequestDto> nomineesRequest);

    Nominee updateNominee(Nominee nominee);

    boolean deleteNominee(Nominee nominee);

}