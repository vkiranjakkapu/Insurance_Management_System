package com.ims.identity.services.imp;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.ims.identity.dto.NomineeRequestDto;
import com.ims.identity.dto.NomineeResponseDto;
import com.ims.identity.entities.Nominee;
import com.ims.identity.entities.User;
import com.ims.identity.exceptions.ResourceNotFoundException;
import com.ims.identity.repository.NomineeRepository;
import com.ims.identity.services.NomineeService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NomineeServiceImp implements NomineeService {

    private final NomineeRepository nomineeRepository;

    @Override
    public List<Nominee> getAllNomineesByCustomer(UUID customerId) {
        return nomineeRepository.findAllByCustomer(User.builder().id(customerId).build());
    }

    @Override
    public Nominee getNomineeById(Long id) {
        return nomineeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nominee Not found with given ID."));
    }

    @Override
    public List<NomineeResponseDto> createAllNominees(List<NomineeRequestDto> nomineesRequest) {
        List<Nominee> nominees = nomineesRequest.stream().map(this::prepareNominee).toList();
        List<Nominee> allNominees = nomineeRepository.saveAll(nominees);
        return allNominees.stream().map(this::prepareNomineeResponse).toList();
    }

    @Override
    public Nominee updateNominee(Nominee nominee) {
        return nomineeRepository.save(nominee);
    }

    @Override
    public boolean deleteNominee(Nominee nominee) {
        nomineeRepository.delete(nominee);
        return true;
    }

    private Nominee prepareNominee(NomineeRequestDto request) {
        return Nominee.builder()
                .name(request.name())
                .email(request.email())
                .phone(request.phone())
                .relationship(request.relationship())
                .customer(User.builder().id(request.customerId()).build())
                .build();
    }

    private NomineeResponseDto prepareNomineeResponse(Nominee nominee) {
        return NomineeResponseDto.builder()
                .id(nominee.getId())
                .name(nominee.getName())
                .email(nominee.getEmail())
                .phone(nominee.getPhone())
                .relationship(nominee.getRelationship())
                .build();
    }

}
