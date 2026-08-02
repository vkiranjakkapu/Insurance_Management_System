package com.ims.premiums.models;

import java.time.LocalDate;
import java.util.UUID;

import com.ims.premiums.enums.UserGender;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class User {

    private UUID id;

    private String email;

    private String password;

    private String firstName;

    private String lastName;

    private String phone;

    private UserGender gender;

    private LocalDate dob;

    private Address address;

    private boolean enabled;

}