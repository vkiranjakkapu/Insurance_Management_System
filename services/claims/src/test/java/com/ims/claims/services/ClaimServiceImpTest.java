package com.ims.claims.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.lenient;
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

import com.ims.claims.dto.AssignClaimRequestDto;
import com.ims.claims.dto.ClaimProofDto;
import com.ims.claims.dto.CreateClaimRequestDto;
import com.ims.claims.dto.UpdateClaimRequestDto;
import com.ims.claims.enums.ClaimStatus;
import com.ims.claims.exception.ForbiddenException;
import com.ims.claims.exception.ResourceNotFoundException;
import com.ims.claims.exception.SubscriptionNotFound;
import com.ims.claims.models.Claim;
import com.ims.claims.models.Document;
import com.ims.claims.models.PolicySubscription;
import com.ims.claims.repository.ClaimRepository;
import com.ims.claims.service.CurrentUserService;
import com.ims.claims.service.DocumentService;
import com.ims.claims.service.PremiumsService;
import com.ims.claims.service.imp.ClaimServiceImp;

@ExtendWith(MockitoExtension.class)
class ClaimServiceImpTest {

	@Mock
	private ClaimRepository claimRepository;

	@Mock
	private DocumentService documentService;

	@Mock
	private PremiumsService subscriptionService;

	@Mock
	private CurrentUserService currentUser;

	@InjectMocks
	private ClaimServiceImp service;

	private UUID customerId;
	private UUID agentId;
	private UUID resolverId;

	private Claim claim;
	private PolicySubscription subscription;
	private Document document;

	private CreateClaimRequestDto createRequest;
	private AssignClaimRequestDto assignRequest;
	private UpdateClaimRequestDto updateRequest;

	@BeforeEach
	void setUp() {

		customerId = UUID.randomUUID();
		agentId = UUID.randomUUID();
		resolverId = UUID.randomUUID();

		document = new Document();
		document.setId(10L);

		subscription = PolicySubscription.builder()
				.id(UUID.randomUUID())
				.customerId(customerId)
				.build();

		claim = new Claim();
		claim.setId(1L);
		claim.setCustomerId(customerId);
		claim.setAgentId(agentId);
		claim.setResolverId(resolverId);
		claim.setStatus(ClaimStatus.INITIATED);
		claim.setProofs(List.of());

		createRequest = new CreateClaimRequestDto(
				subscription.getId(),
				"Medical emergency",
				List.of(
						ClaimProofDto.builder()
								.docId(10L)
								.build()),
				ClaimStatus.INITIATED);

		assignRequest = new AssignClaimRequestDto(
				1L,
				customerId,
				agentId,
				"Dealer ABC");

		updateRequest = new UpdateClaimRequestDto(
				1L,
				ClaimStatus.APPROVED);

		lenient().when(currentUser.userId()).thenReturn(customerId);
	}

	@Test
	void shouldReturnClaimByIdForAdmin() {

		when(claimRepository.findById(1L)).thenReturn(Optional.of(claim));
		when(currentUser.isAdmin()).thenReturn(true);

		Claim result = service.getClaimById(1L);

		assertNotNull(result);
		assertEquals(claim, result);

		verify(claimRepository).findById(1L);
		verify(currentUser).isAdmin();
	}

	@Test
	void shouldReturnClaimForOwnerCustomer() {

		when(claimRepository.findById(1L)).thenReturn(Optional.of(claim));

		when(currentUser.isAdmin()).thenReturn(false);
		when(currentUser.isCustomer()).thenReturn(true);
		when(currentUser.userId()).thenReturn(customerId);

		Claim result = service.getClaimById(1L);

		assertEquals(claim, result);

		verify(claimRepository).findById(1L);
	}

	@Test
	void shouldThrowForbiddenWhenCustomerAccessesOthersClaim() {

		when(claimRepository.findById(1L)).thenReturn(Optional.of(claim));

		when(currentUser.isAdmin()).thenReturn(false);
		when(currentUser.isCustomer()).thenReturn(true);
		when(currentUser.userId()).thenReturn(UUID.randomUUID());

		assertThrows(
				ForbiddenException.class,
				() -> service.getClaimById(1L));

		verify(claimRepository).findById(1L);
	}

	@Test
	void shouldReturnClaimForAssignedAgent() {

		when(claimRepository.findById(1L)).thenReturn(Optional.of(claim));

		when(currentUser.isAdmin()).thenReturn(false);
		when(currentUser.isCustomer()).thenReturn(false);
		when(currentUser.isAgent()).thenReturn(true);
		when(currentUser.userId()).thenReturn(agentId);

		Claim result = service.getClaimById(1L);

		assertEquals(claim, result);

		verify(claimRepository).findById(1L);
	}

	@Test
	void shouldThrowForbiddenWhenClaimAssignedToDifferentAgent() {

		when(claimRepository.findById(1L)).thenReturn(Optional.of(claim));

		when(currentUser.isAdmin()).thenReturn(false);
		when(currentUser.isCustomer()).thenReturn(false);
		when(currentUser.isAgent()).thenReturn(true);
		when(currentUser.userId()).thenReturn(UUID.randomUUID());

		assertThrows(
				ForbiddenException.class,
				() -> service.getClaimById(1L));

		verify(claimRepository).findById(1L);
	}

	@Test
	void shouldThrowWhenClaimNotFound() {

		when(claimRepository.findById(1L))
				.thenReturn(Optional.empty());

		assertThrows(
				ResourceNotFoundException.class,
				() -> service.getClaimById(1L));

		verify(claimRepository).findById(1L);
	}

	@Test
	void shouldReturnAllClaims() {

		List<Claim> claims = List.of(claim);

		when(claimRepository.findAll()).thenReturn(claims);

		List<Claim> result = service.getAllClaims();

		assertEquals(1, result.size());
		assertEquals(claims, result);

		verify(claimRepository).findAll();
	}

	@Test
	void shouldReturnClaimsByAgent() {

		List<Claim> claims = List.of(claim);

		when(claimRepository.findAllByAgentId(agentId)).thenReturn(claims);

		List<Claim> result = service.getAllClaimsByAgent(agentId);

		assertEquals(claims, result);

		verify(claimRepository).findAllByAgentId(agentId);
	}

	@Test
	void shouldReturnClaimsByCustomer() {

		List<Claim> claims = List.of(claim);

		when(claimRepository.findAllByCustomerId(customerId)).thenReturn(claims);

		List<Claim> result = service.getAllClaimsByCustomer(customerId);

		assertEquals(claims, result);

		verify(claimRepository).findAllByCustomerId(customerId);
	}

	@Test
	void shouldReturnClaimsByStatus() {

		List<Claim> claims = List.of(claim);

		when(claimRepository.findAllByStatus(ClaimStatus.INITIATED)).thenReturn(claims);

		List<Claim> result = service.getAllByStatus(ClaimStatus.INITIATED);

		assertEquals(claims, result);

		verify(claimRepository).findAllByStatus(ClaimStatus.INITIATED);
	}

	@Test
	void shouldAssignClaimToAgent() {

		when(claimRepository.findById(1L)).thenReturn(Optional.of(claim));
		when(currentUser.isAdmin()).thenReturn(true);
		when(currentUser.userId()).thenReturn(resolverId);
		when(claimRepository.save(claim)).thenReturn(claim);

		Claim result = service.assignClaimToAgent(assignRequest);

		assertNotNull(result);
		assertEquals(agentId, result.getAgentId());
		assertEquals("Dealer ABC", result.getAgentName());
		assertEquals(ClaimStatus.ASSIGNED, result.getStatus());
		assertEquals(resolverId, result.getResolverId());

		verify(claimRepository).save(claim);
	}

	@Test
	void shouldCreateClaim() {

		when(currentUser.userId()).thenReturn(customerId);

		when(subscriptionService.getSubscriptionById(subscription.getId()))
				.thenReturn(subscription);

		when(documentService.getDocumentById(10L))
				.thenReturn(document);

		when(claimRepository.save(org.mockito.ArgumentMatchers.any(Claim.class)))
				.thenAnswer(invocation -> invocation.getArgument(0));

		Claim result = service.createClaim(createRequest);

		assertNotNull(result);
		assertEquals(subscription.getId(), result.getSubscriptionId());
		assertEquals(customerId, result.getResolverId());
		assertEquals(1, result.getProofs().size());
		assertEquals(document.getId(), result.getProofs().get(0).getDocumentId());

		verify(subscriptionService).getSubscriptionById(subscription.getId());
		verify(documentService).getDocumentById(10L);
		verify(claimRepository).save(org.mockito.ArgumentMatchers.any(Claim.class));
	}

	@Test
	void shouldThrowWhenSubscriptionDoesNotBelongToCurrentUser() {

		when(currentUser.userId()).thenReturn(UUID.randomUUID());

		when(subscriptionService.getSubscriptionById(subscription.getId()))
				.thenReturn(subscription);

		assertThrows(
				SubscriptionNotFound.class,
				() -> service.createClaim(createRequest));

		verify(subscriptionService).getSubscriptionById(subscription.getId());
	}

	@Test
	void shouldMapEveryProofDocument() {

		ClaimProofDto proof1 = ClaimProofDto.builder()
				.docId(10L)
				.build();

		ClaimProofDto proof2 = ClaimProofDto.builder()
				.docId(20L)
				.build();

		CreateClaimRequestDto request = new CreateClaimRequestDto(
				subscription.getId(),
				"Reason",
				List.of(proof1, proof2),
				ClaimStatus.INITIATED);

		Document doc1 = new Document();
		doc1.setId(10L);

		Document doc2 = new Document();
		doc2.setId(20L);

		when(currentUser.userId()).thenReturn(customerId);

		when(subscriptionService.getSubscriptionById(subscription.getId()))
				.thenReturn(subscription);

		when(documentService.getDocumentById(10L)).thenReturn(doc1);
		when(documentService.getDocumentById(20L)).thenReturn(doc2);

		when(claimRepository.save(org.mockito.ArgumentMatchers.any(Claim.class)))
				.thenAnswer(invocation -> invocation.getArgument(0));

		Claim result = service.createClaim(request);

		assertEquals(2, result.getProofs().size());
		assertEquals(doc1.getId(), result.getProofs().get(0).getDocumentId());
		assertEquals(doc2.getId(), result.getProofs().get(1).getDocumentId());

		verify(documentService).getDocumentById(10L);
		verify(documentService).getDocumentById(20L);
	}

	@Test
	void shouldUpdateClaim() {

		when(claimRepository.findById(1L)).thenReturn(java.util.Optional.of(claim));
		when(currentUser.isAdmin()).thenReturn(true);
		when(currentUser.userId()).thenReturn(resolverId);
		when(claimRepository.save(claim)).thenReturn(claim);

		Claim result = service.updateClaim(updateRequest);

		assertNotNull(result);
		assertEquals(ClaimStatus.APPROVED, result.getStatus());
		assertEquals(resolverId, result.getResolverId());

		verify(claimRepository).save(claim);
	}

	@Test
	void shouldUpdateClaimForAssignedAgent() {

		when(claimRepository.findById(1L)).thenReturn(java.util.Optional.of(claim));

		when(currentUser.isAdmin()).thenReturn(false);
		when(currentUser.isCustomer()).thenReturn(false);
		when(currentUser.isAgent()).thenReturn(true);
		when(currentUser.userId()).thenReturn(agentId);

		when(claimRepository.save(claim)).thenReturn(claim);

		Claim result = service.updateClaim(updateRequest);

		assertEquals(ClaimStatus.APPROVED, result.getStatus());
		assertEquals(agentId, result.getResolverId());

		verify(claimRepository).save(claim);
	}

	@Test
	void shouldThrowWhenUpdatingClaimAssignedToAnotherAgent() {

		when(claimRepository.findById(1L)).thenReturn(java.util.Optional.of(claim));

		when(currentUser.isAdmin()).thenReturn(false);
		when(currentUser.isCustomer()).thenReturn(false);
		when(currentUser.isAgent()).thenReturn(true);
		when(currentUser.userId()).thenReturn(UUID.randomUUID());

		assertThrows(
				ForbiddenException.class,
				() -> service.updateClaim(updateRequest));

		verify(claimRepository).findById(1L);
	}

	@Test
	void shouldPersistUpdatedClaim() {

		when(claimRepository.findById(1L)).thenReturn(java.util.Optional.of(claim));
		when(currentUser.isAdmin()).thenReturn(true);
		when(currentUser.userId()).thenReturn(resolverId);

		when(claimRepository.save(claim))
				.thenReturn(claim);

		service.updateClaim(updateRequest);

		verify(claimRepository).save(claim);
	}

	@Test
	void shouldAssignResolverDuringUpdate() {

		when(claimRepository.findById(1L)).thenReturn(java.util.Optional.of(claim));
		when(currentUser.isAdmin()).thenReturn(true);
		when(currentUser.userId()).thenReturn(resolverId);

		when(claimRepository.save(claim))
				.thenAnswer(invocation -> invocation.getArgument(0));

		Claim result = service.updateClaim(updateRequest);

		assertEquals(resolverId, result.getResolverId());
	}
}