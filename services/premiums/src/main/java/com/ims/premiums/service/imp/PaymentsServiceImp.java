package com.ims.premiums.service.imp;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ims.premiums.exception.ResourceNotFoundException;
import com.ims.premiums.models.PolicySubscription;
import com.ims.premiums.models.PremiumPayment;
import com.ims.premiums.repository.PremiumPaymentsRepository;
import com.ims.premiums.service.PaymentsService;

@Service
public class PaymentsServiceImp implements PaymentsService {

    private PremiumPaymentsRepository paymentsRepository;

    PaymentsServiceImp(PremiumPaymentsRepository paymentsRepository) {
        this.paymentsRepository = paymentsRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public PremiumPayment getPremiumPaymentById(UUID id) {
        return paymentsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No payment found with given id."));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PremiumPayment> getAllPremiumPayments() {
        return paymentsRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PremiumPayment> getAllPremiumPaymentsByCustomer(UUID customerId) {
        return paymentsRepository.findAllByCustomerId(customerId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PremiumPayment> getAllPremiumPaymentsBySubscription(UUID subscriptionId) {
        return paymentsRepository.findAllBySubscription(PolicySubscription.builder().id(subscriptionId).build());
    }

    @Override
    @Transactional
    public PremiumPayment payPremium(UUID paymentId) {
        PremiumPayment premium = getPremiumPaymentById(paymentId);
        return paymentsRepository.save(premium);
    }

}
