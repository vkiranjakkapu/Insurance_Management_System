package com.ims.claims.models;

import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {

    private UUID id;

    private String email;

    private String password;

    private String firstName;

    private String lastName;

    private String phone;

    private LocalDate dob;

    private Address address;

    private boolean enabled;

    private boolean deleted;

    private Set<Role> roles;

}