package com.ims.claims.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import com.ims.claims.dto.APIResponseDto;
import com.ims.claims.dto.AssignClaimRequestDto;
import com.ims.claims.dto.ClaimResponseDto;
import com.ims.claims.dto.CreateClaimRequestDto;
import com.ims.claims.dto.SubscriptionsResposneDto;
import com.ims.claims.dto.UpdateClaimRequestDto;
import com.ims.claims.enums.ClaimStatus;
import com.ims.claims.exception.UnauthorizedException;
import com.ims.claims.models.Claim;
import com.ims.claims.models.User;
import com.ims.claims.service.ClaimService;
import com.ims.claims.service.CurrentUserService;
import com.ims.claims.service.PremiumsService;
import com.ims.claims.service.imp.CustomersServiceImp;

@ExtendWith(MockitoExtension.class)
class ClaimsControllerTest {

	@Mock
	private ClaimService claimService;

	@Mock
	private CurrentUserService currentUser;

	@Mock
	private PremiumsService premiumsService;

	@Mock
	private CustomersServiceImp customersService;

	@InjectMocks
	private ClaimsController controller;

	private Claim claim;
	private CreateClaimRequestDto createRequest;
	private AssignClaimRequestDto assignRequest;
	private UpdateClaimRequestDto updateRequest;
	private SubscriptionsResposneDto subscription;

	private UUID customerId;
	private UUID agentId;
	private UUID resolverId;
	private UUID subscriptionId;

	@BeforeEach
	void setUp() {

		customerId = UUID.randomUUID();
		agentId = UUID.randomUUID();
		resolverId = UUID.randomUUID();
		subscriptionId = UUID.randomUUID();

		subscription = SubscriptionsResposneDto.builder()
				.id(subscriptionId)
				.customer(User.builder().id(customerId).build())
				.build();

		claim = new Claim();
		claim.setId(1L);
		claim.setClaimId("CLAIM-0001");
		claim.setCustomerId(customerId);
		claim.setAgentId(agentId);
		claim.setResolverId(resolverId);
		claim.setSubscriptionId(subscriptionId);
		claim.setReason("Medical Emergency");
		claim.setStatus(ClaimStatus.INITIATED);
		claim.setCreatedAt(LocalDateTime.now());
		claim.setUpdatedAt(LocalDateTime.now());

		claim.setProofs(List.of());

		createRequest = new CreateClaimRequestDto(
				claim.getSubscriptionId(),
				customerId,
				"Medical Emergency",
				List.of());

		assignRequest = new AssignClaimRequestDto(
				1L,
				agentId,
				resolverId,
				"Dealer");

		updateRequest = new UpdateClaimRequestDto(
				1L,
				ClaimStatus.APPROVED);
	}

	@Test
	void shouldGetClaimById() {

		ClaimResponseDto dto = ClaimResponseDto.builder().build();

		when(claimService.getClaimByClaimId("CLAIM-0001"))
				.thenReturn(claim);

		when(claimService.mapClaimResponse(claim))
				.thenReturn(dto);

		ResponseEntity<APIResponseDto> response = controller.getClaimById("CLAIM-0001");

		assertEquals(200, response.getStatusCode().value());
		assertEquals(dto, response.getBody().getBody());

		verify(claimService).getClaimByClaimId("CLAIM-0001");
		verify(claimService).mapClaimResponse(claim);
	}

	@Test
	void shouldCreateClaim() {
		when(premiumsService.getSubscriptionById(subscriptionId))
				.thenReturn(subscription);

		when(claimService.createClaim(createRequest))
				.thenReturn(claim);

		ResponseEntity<APIResponseDto> response = controller.createClaim(createRequest);

		assertEquals(200, response.getStatusCode().value());
		assertEquals(claim, response.getBody().getBody());

		verify(premiumsService).getSubscriptionById(subscriptionId);
		verify(claimService).createClaim(createRequest);
	}

	@Test
	void shouldThrowWhenSubscriptionDoesNotBelongToCustomer() {

		SubscriptionsResposneDto invalidSubscription = SubscriptionsResposneDto.builder()
				.id(subscriptionId)
				.customer(User.builder()
						.id(UUID.randomUUID())
						.build())
				.build();

		when(premiumsService.getSubscriptionById(subscriptionId))
				.thenReturn(invalidSubscription);

		assertThrows(
				UnauthorizedException.class,
				() -> controller.createClaim(createRequest));

		verify(premiumsService).getSubscriptionById(subscriptionId);
	}

	@Test
	void shouldAssignClaim() {

		when(claimService.assignClaimToAgent(assignRequest)).thenReturn(claim);

		ResponseEntity<APIResponseDto> response = controller.assignClaim(assignRequest);

		assertEquals(200, response.getStatusCode().value());

		verify(claimService).assignClaimToAgent(assignRequest);
	}

	@Test
	void shouldUpdateClaim() {
		ClaimResponseDto dto = ClaimResponseDto.builder().build();

		when(claimService.updateClaim(updateRequest))
				.thenReturn(claim);

		when(claimService.mapClaimResponse(claim))
				.thenReturn(dto);

		ResponseEntity<APIResponseDto> response = controller.updateClaim(updateRequest);

		assertEquals(200, response.getStatusCode().value());
		assertEquals(dto, response.getBody().getBody());

		verify(claimService).updateClaim(updateRequest);
		verify(claimService).mapClaimResponse(claim);
	}

	@Test
	void shouldGetAllClaimsForAdmin() {

		User customer = User.builder().id(customerId).build();
		User agent = User.builder().id(agentId).build();
		User resolver = User.builder().id(resolverId).build();

		when(currentUser.isAdmin()).thenReturn(true);
		when(claimService.getAllClaims()).thenReturn(List.of(claim));

		when(customersService.getAllUsersByIds(
				java.util.Set.of(customerId, agentId, resolverId)))
				.thenReturn(Map.of(
						customerId, customer,
						agentId, agent,
						resolverId, resolver));

		ClaimResponseDto dto = ClaimResponseDto.builder().build();

		when(claimService.mapClaimResponse(
				org.mockito.ArgumentMatchers.eq(claim),
				org.mockito.ArgumentMatchers.anyMap()))
				.thenReturn(dto);
		ResponseEntity<APIResponseDto> response = controller.getAllClaims();

		assertEquals(200, response.getStatusCode().value());

		List<?> body = (List<?>) response.getBody().getBody();

		assertEquals(1, body.size());

		verify(claimService).getAllClaims();
	}

	@Test
	void shouldGetAllClaimsForAgent() {

		when(currentUser.isAdmin()).thenReturn(false);
		when(currentUser.isAgent()).thenReturn(true);
		when(currentUser.userId()).thenReturn(agentId);

		when(claimService.getAllClaimsByAgent(agentId))
				.thenReturn(List.of(claim));

		when(customersService.getAllUsersByIds(
				java.util.Set.of(customerId, agentId, resolverId)))
				.thenReturn(Map.of(
						customerId, User.builder().id(customerId).build(),
						agentId, User.builder().id(agentId).build(),
						resolverId, User.builder().id(resolverId).build()));

		ClaimResponseDto dto = ClaimResponseDto.builder().build();

		when(claimService.mapClaimResponse(
				org.mockito.ArgumentMatchers.eq(claim),
				org.mockito.ArgumentMatchers.anyMap()))
				.thenReturn(dto);

		ResponseEntity<APIResponseDto> response = controller.getAllClaims();

		assertEquals(200, response.getStatusCode().value());

		verify(claimService).getAllClaimsByAgent(agentId);
	}

	@Test
	void shouldGetAllClaimsForCustomer() {

		when(currentUser.isAdmin()).thenReturn(false);
		when(currentUser.isAgent()).thenReturn(false);
		when(currentUser.userId()).thenReturn(customerId);

		when(claimService.getAllClaimsByCustomer(customerId))
				.thenReturn(List.of(claim));

		when(customersService.getAllUsersByIds(
				java.util.Set.of(customerId, agentId, resolverId)))
				.thenReturn(Map.of(
						customerId, User.builder().id(customerId).build(),
						agentId, User.builder().id(agentId).build(),
						resolverId, User.builder().id(resolverId).build()));

		ClaimResponseDto dto = ClaimResponseDto.builder().build();

		when(claimService.mapClaimResponse(
				org.mockito.ArgumentMatchers.eq(claim),
				org.mockito.ArgumentMatchers.anyMap()))
				.thenReturn(dto);

		ResponseEntity<APIResponseDto> response = controller.getAllClaims();

		assertEquals(200, response.getStatusCode().value());

		verify(claimService).getAllClaimsByCustomer(customerId);
	}
}