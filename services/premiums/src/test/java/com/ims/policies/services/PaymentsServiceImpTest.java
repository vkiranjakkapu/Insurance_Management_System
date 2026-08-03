package com.ims.policies.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.ims.premiums.exception.ResourceNotFoundException;
import com.ims.premiums.models.PolicySubscription;
import com.ims.premiums.models.PremiumPayment;
import com.ims.premiums.repository.PremiumPaymentsRepository;
import com.ims.premiums.service.imp.CurrentUserServiceImp;
import com.ims.premiums.service.imp.PaymentsServiceImp;

@ExtendWith(MockitoExtension.class)
class PaymentsServiceImpTest {

	@Mock
	private PremiumPaymentsRepository paymentsRepository;

	@Mock
	private CurrentUserServiceImp currentUser;

	@InjectMocks
	private PaymentsServiceImp service;

	private UUID paymentId;
	private UUID customerId;
	private UUID subscriptionId;

	private PremiumPayment payment;

	@BeforeEach
	void setUp() {

		paymentId = UUID.randomUUID();
		customerId = UUID.randomUUID();
		subscriptionId = UUID.randomUUID();

		payment = new PremiumPayment();
		payment.setId(paymentId);
		payment.setCustomerId(customerId);
		payment.setSubscription(
				PolicySubscription.builder()
						.id(subscriptionId)
						.build());
	}

	@Test
	void shouldReturnPremiumPaymentById() {

		when(paymentsRepository.findById(paymentId))
				.thenReturn(Optional.of(payment));

		PremiumPayment result = service.getPremiumPaymentById(paymentId);

		assertSame(payment, result);

		verify(paymentsRepository).findById(paymentId);
	}

	@Test
	void shouldThrowWhenPaymentNotFound() {

		when(paymentsRepository.findById(paymentId))
				.thenReturn(Optional.empty());

		assertThrows(
				ResourceNotFoundException.class,
				() -> service.getPremiumPaymentById(paymentId));

		verify(paymentsRepository).findById(paymentId);
	}

	@Test
	void shouldReturnAllPremiumPayments() {

		List<PremiumPayment> payments = List.of(payment);

		when(paymentsRepository.findAll())
				.thenReturn(payments);

		List<PremiumPayment> result = service.getAllPremiumPayments();

		assertEquals(payments, result);

		verify(paymentsRepository).findAll();
	}

	@Test
	void shouldReturnPaymentsByCustomer() {

		List<PremiumPayment> payments = List.of(payment);

		when(paymentsRepository.findAllByCustomerId(customerId))
				.thenReturn(payments);

		List<PremiumPayment> result = service.getAllPremiumPaymentsByCustomer(customerId);

		assertEquals(payments, result);

		verify(paymentsRepository).findAllByCustomerId(customerId);
	}

	@Test
	void shouldReturnPaymentsBySubscription() {

		List<PremiumPayment> payments = List.of(payment);

		when(paymentsRepository.findAllBySubscription(any(PolicySubscription.class)))
				.thenReturn(payments);

		List<PremiumPayment> result = service.getAllPremiumPaymentsBySubscription(subscriptionId);

		assertEquals(payments, result);

		verify(paymentsRepository)
				.findAllBySubscription(any(PolicySubscription.class));
	}

	@Test
	void shouldPayPremium() {

		when(paymentsRepository.findById(paymentId))
				.thenReturn(Optional.of(payment));

		when(currentUser.userId())
				.thenReturn(customerId);

		when(paymentsRepository.save(payment))
				.thenReturn(payment);

		PremiumPayment result = service.payPremium(paymentId);

		assertSame(payment, result);

		verify(currentUser).userId();
		verify(paymentsRepository).findById(paymentId);
		verify(paymentsRepository).save(payment);
	}
}