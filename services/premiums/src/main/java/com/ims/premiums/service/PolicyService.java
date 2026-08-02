package com.ims.premiums.service;

import java.util.List;
import java.util.Map;

import com.ims.premiums.models.Policy;

public interface PolicyService {

    Policy getPolicyById(Long id);

    Map<Long, Policy> getAllPolicyByIds(List<Long> ids);

}