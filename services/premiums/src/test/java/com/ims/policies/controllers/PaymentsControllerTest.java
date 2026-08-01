package com.ims.policies.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import com.ims.premiums.controllers.PaymentsController;
import com.ims.premiums.dto.APIResponseDto;
import com.ims.premiums.models.PremiumPayment;
import com.ims.premiums.service.CurrentUserService;
import com.ims.premiums.service.PaymentsService;

@ExtendWith(MockitoExtension.class)
class PaymentsControllerTest {

    @Mock
    private PaymentsService paymentsService;

    @Mock
    private CurrentUserService currentUser;

    @InjectMocks
    private PaymentsController controller;

    private UUID id;
    private PremiumPayment payment;

    @BeforeEach
    void setUp() {
        id = UUID.randomUUID();
        payment = new PremiumPayment();
    }

    @Test
    void shouldGetAllPaymentsForAdmin() {

        List<PremiumPayment> payments = List.of(payment);

        when(currentUser.isAdmin()).thenReturn(true);
        when(paymentsService.getAllPremiumPayments()).thenReturn(payments);

        ResponseEntity<APIResponseDto> response = controller.getAllPayments();

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals(payments, response.getBody().getBody());

        verify(currentUser).isAdmin();
        verify(paymentsService).getAllPremiumPayments();
    }

    @Test
    void shouldGetAllPaymentsForCustomer() {

        List<PremiumPayment> payments = List.of(payment);

        when(currentUser.isAdmin()).thenReturn(false);
        when(currentUser.userId()).thenReturn(id);
        when(paymentsService.getAllPremiumPaymentsByCustomer(id)).thenReturn(payments);

        ResponseEntity<APIResponseDto> response = controller.getAllPayments();

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals(payments, response.getBody().getBody());

        verify(currentUser).isAdmin();
        verify(currentUser).userId();
        verify(paymentsService).getAllPremiumPaymentsByCustomer(id);
    }

    @Test
    void shouldGetPaymentsBySubscription() {

        List<PremiumPayment> payments = List.of(payment);

        when(paymentsService.getAllPremiumPaymentsBySubscription(id)).thenReturn(payments);

        ResponseEntity<APIResponseDto> response = controller.getAllPaymentsBySubscription(id);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());

        APIResponseDto body = (APIResponseDto) response.getBody().getBody();

        assertEquals(payments, body.getBody());

        verify(paymentsService).getAllPremiumPaymentsBySubscription(id);
    }

    @Test
    void shouldPayPremium() {

        when(paymentsService.payPremium(id)).thenReturn(payment);

        ResponseEntity<APIResponseDto> response = controller.payPremium(id);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());

        APIResponseDto body = (APIResponseDto) response.getBody().getBody();

        assertEquals(payment, body.getBody());

        verify(paymentsService).payPremium(id);
    }
}