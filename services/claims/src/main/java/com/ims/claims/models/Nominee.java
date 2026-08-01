package com.ims.claims.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Nominee {

    private Long id;

    private User customer;

    private String name;

    private String email;

    private String phone;

    private String relation;

}
