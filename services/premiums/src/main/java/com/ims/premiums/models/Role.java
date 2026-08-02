package com.ims.premiums.models;

import com.ims.premiums.enums.RoleType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Role {

    private Long id;

    private RoleType name;

    private String description;
}