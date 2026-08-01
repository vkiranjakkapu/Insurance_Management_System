package com.ims.premiums.service;

import java.util.List;
import java.util.UUID;

import com.ims.premiums.models.PremiumPayment;

public interface PaymentsService {

    PremiumPayment getPremiumPaymentById(UUID id);

    List<PremiumPayment> getAllPremiumPayments();

    List<PremiumPayment> getAllPremiumPaymentsByCustomer(UUID customerId);

    List<PremiumPayment> getAllPremiumPaymentsBySubscription(UUID subscriptionId);

    PremiumPayment payPremium(UUID paymentId);

}