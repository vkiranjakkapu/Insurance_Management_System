package com.ims.premiums.models;

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
public class Address {

    private Long id;

    private String street;

    private String pinCode;

    private String state;

    private String country;

    private boolean deleted;

}