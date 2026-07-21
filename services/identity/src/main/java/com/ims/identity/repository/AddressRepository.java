package com.ims.identity.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ims.identity.entities.Address;

public interface AddressRepository extends JpaRepository<Address, Long> {
    
}
