package com.ims.policies.models;

import com.ims.policies.enums.RoleType;

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