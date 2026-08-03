package com.ims.claims.service;

import java.util.UUID;

import com.ims.claims.dto.SubscriptionsResposneDto;

public interface PremiumsService {

    SubscriptionsResposneDto getSubscriptionById(UUID id);

}