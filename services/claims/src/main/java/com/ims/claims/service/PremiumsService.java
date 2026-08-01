package com.ims.claims.service;

import java.util.UUID;

import com.ims.claims.models.PolicySubscription;

public interface PremiumsService {

    PolicySubscription getSubscriptionById(UUID id);

}