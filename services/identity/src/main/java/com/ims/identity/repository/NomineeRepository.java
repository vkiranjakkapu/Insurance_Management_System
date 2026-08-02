package com.ims.identity.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ims.identity.entities.Nominee;
import com.ims.identity.entities.User;

public interface NomineeRepository extends JpaRepository<Nominee, Long> {

    List<Nominee> findAllByCustomer(User customer);
    
}
