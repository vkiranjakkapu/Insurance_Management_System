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
import com.ims.claims.dto.CreateClaimRequestDto;
import com.ims.claims.dto.SubscriptionsResposneDto;
import com.ims.claims.dto.UpdateClaimRequestDto;
import com.ims.claims.enums.ClaimStatus;
import com.ims.claims.exception.UnauthorizedException;
import com.ims.claims.models.Claim;
import com.ims.claims.models.ClaimProof;
import com.ims.claims.models.Document;
import com.ims.claims.models.User;
import com.ims.claims.service.ClaimService;
import com.ims.claims.service.CurrentUserService;
import com.ims.claims.service.DocumentService;
import com.ims.claims.service.PremiumsService;
import com.ims.claims.service.imp.CustomersServiceImp;

@ExtendWith(MockitoExtension.class)
class ClaimsControllerTest {

	@Mock
	private ClaimService claimService;

	@Mock
	private CurrentUserService currentUser;

	@Mock
	private DocumentService documentService;

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

		ClaimProof proof = new ClaimProof();
		proof.setDocumentId(10L);

		claim.setProofs(List.of(proof));

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

		when(claimService.getClaimById(1L)).thenReturn(claim);

		ResponseEntity<APIResponseDto> response = controller.getClaimById(1L);

		assertEquals(200, response.getStatusCode().value());
		assertEquals(claim, response.getBody().getBody());

		verify(claimService).getClaimById(1L);
	}

	@Test
	void shouldCreateClaim() {

		when(claimService.createClaim(createRequest)).thenReturn(claim);

		ResponseEntity<APIResponseDto> response = controller.createClaim(createRequest);

		assertEquals(200, response.getStatusCode().value());
		assertEquals(claim, response.getBody().getBody());

		verify(claimService).createClaim(createRequest);
	}

	@Test
	void shouldThrowWhenSubscriptionDoesNotBelongToCurrentUser() {

		when(currentUser.userId()).thenReturn(UUID.randomUUID());

		when(premiumsService.getSubscriptionById(subscription.id()))
				.thenReturn(subscription);

		assertThrows(
				UnauthorizedException.class,
				() -> claimService.createClaim(createRequest));

		verify(premiumsService).getSubscriptionById(subscription.id());
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

		when(claimService.updateClaim(updateRequest)).thenReturn(claim);

		ResponseEntity<APIResponseDto> response = controller.updateClaim(updateRequest);

		assertEquals(200, response.getStatusCode().value());

		verify(claimService).updateClaim(updateRequest);
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

		when(documentService.getDocumentById(10L))
				.thenReturn(new Document());

		when(premiumsService.getSubscriptionById(claim.getSubscriptionId()))
				.thenReturn(null);

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

		when(documentService.getDocumentById(10L))
				.thenReturn(new Document());

		when(premiumsService.getSubscriptionById(claim.getSubscriptionId()))
				.thenReturn(null);

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

		when(documentService.getDocumentById(10L))
				.thenReturn(new Document());

		when(premiumsService.getSubscriptionById(claim.getSubscriptionId()))
				.thenReturn(null);

		ResponseEntity<APIResponseDto> response = controller.getAllClaims();

		assertEquals(200, response.getStatusCode().value());

		verify(claimService).getAllClaimsByCustomer(customerId);
	}
}