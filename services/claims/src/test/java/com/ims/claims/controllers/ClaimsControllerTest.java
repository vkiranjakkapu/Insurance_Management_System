package com.ims.claims.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestClient;

import com.ims.claims.dto.APIResponseDto;
import com.ims.claims.dto.AssignClaimRequestDto;
import com.ims.claims.dto.CreateClaimRequestDto;
import com.ims.claims.dto.FetchUsersRequestDto;
import com.ims.claims.dto.FetchUsersResponseDto;
import com.ims.claims.dto.UpdateClaimRequestDto;
import com.ims.claims.enums.ClaimStatus;
import com.ims.claims.models.Claim;
import com.ims.claims.models.User;
import com.ims.claims.service.ClaimService;
import com.ims.claims.service.CurrentUserService;
import com.ims.claims.service.DocumentService;
import com.ims.claims.service.PremiumsService;

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
	private RestClient.Builder builder;

	@Mock
	private RestClient restClient;

	private ClaimsController controller;

	@Mock
	private RestClient.RequestBodyUriSpec requestBodyUriSpec;

	@Mock
	private RestClient.RequestBodySpec requestBodySpec;

	@Mock
	private RestClient.ResponseSpec responseSpec;

	private Claim claim;
	private CreateClaimRequestDto createRequest;
	private AssignClaimRequestDto assignRequest;
	private UpdateClaimRequestDto updateRequest;

	@BeforeEach
	void setUp() {

		when(builder.build()).thenReturn(restClient);

		controller = new ClaimsController(
				claimService,
				currentUser,
				documentService,
				premiumsService,
				builder);

		claim = new Claim();
		claim.setId(1L);

		UUID id = UUID.randomUUID();

		createRequest = new CreateClaimRequestDto(
				id,
				"Medical Emergency",
				List.of(),
				ClaimStatus.INITIATED);

		assignRequest = new AssignClaimRequestDto(
				1L,
				id,
				UUID.randomUUID(),
				"Dealer");

		updateRequest = new UpdateClaimRequestDto(
				1L,
				ClaimStatus.APPROVED);
		ReflectionTestUtils.setField(
				controller,
				"IDENTITY_SERVICE_URL",
				"http://localhost:8080/");
	}

	@Test
	void shouldGetClaimById() {

		when(claimService.getClaimById(1L)).thenReturn(claim);

		ResponseEntity<APIResponseDto> response = controller.getClaimById(1L);

		assertEquals(200, response.getStatusCode().value());
		assertNotNull(response.getBody());
		assertEquals(claim, response.getBody().getBody());

		verify(claimService).getClaimById(1L);
	}

	@Test
	void shouldCreateClaim() {

		when(claimService.createClaim(createRequest)).thenReturn(claim);

		ResponseEntity<APIResponseDto> response = controller.createClaim(createRequest);

		assertEquals(200, response.getStatusCode().value());
		assertNotNull(response.getBody());
		assertEquals(claim, response.getBody().getBody());

		verify(claimService).createClaim(createRequest);
	}

	@Test
	void shouldAssignClaim() {

		when(claimService.assignClaimToAgent(assignRequest)).thenReturn(claim);

		ResponseEntity<APIResponseDto> response = controller.assignClaim(assignRequest);

		assertEquals(200, response.getStatusCode().value());
		assertNotNull(response.getBody());
		assertEquals(claim, response.getBody().getBody());

		verify(claimService).assignClaimToAgent(assignRequest);
	}

	@Test
	void shouldUpdateClaim() {

		when(claimService.updateClaim(updateRequest)).thenReturn(claim);

		ResponseEntity<APIResponseDto> response = controller.updateClaim(updateRequest);

		assertEquals(200, response.getStatusCode().value());
		assertNotNull(response.getBody());
		assertEquals(claim, response.getBody().getBody());

		verify(claimService).updateClaim(updateRequest);
	}

	@Test
	void shouldGetAllClaimsForAdmin() {

		UUID customerId = UUID.randomUUID();
		UUID agentId = UUID.randomUUID();
		UUID resolverId = UUID.randomUUID();

		Claim claim = new Claim();
		claim.setId(1L);
		claim.setCustomerId(customerId);
		claim.setAgentId(agentId);
		claim.setResolverId(resolverId);
		claim.setProofs(List.of());

		User customer = User.builder().id(customerId).build();
		User agent = User.builder().id(agentId).build();
		User resolver = User.builder().id(resolverId).build();

		FetchUsersResponseDto users = FetchUsersResponseDto.builder()
				.users(List.of(customer, agent, resolver))
				.build();

		when(currentUser.isAdmin()).thenReturn(true);
		when(claimService.getAllClaims()).thenReturn(List.of(claim));

		when(restClient.post()).thenReturn(requestBodyUriSpec);
		when(requestBodyUriSpec.uri(anyString())).thenReturn(requestBodySpec);
		when(requestBodySpec.body(any(FetchUsersRequestDto.class)))
				.thenReturn(requestBodySpec);
		when(requestBodySpec.retrieve()).thenReturn(responseSpec);
		when(responseSpec.body(FetchUsersResponseDto.class)).thenReturn(users);

		ResponseEntity<APIResponseDto> response = controller.getAllClaims();

		assertEquals(200, response.getStatusCode().value());
		assertNotNull(response.getBody());
		assertNotNull(response.getBody().getBody());

		List<?> body = (List<?>) response.getBody().getBody();
		assertEquals(1, body.size());

		verify(currentUser).isAdmin();
		verify(claimService).getAllClaims();
	}

	@Test
	void shouldGetAllClaimsForAgent() {

		UUID agentId = UUID.randomUUID();
		UUID customerId = UUID.randomUUID();
		UUID resolverId = UUID.randomUUID();

		Claim claim = new Claim();
		claim.setCustomerId(customerId);
		claim.setAgentId(agentId);
		claim.setResolverId(resolverId);
		claim.setProofs(List.of());

		FetchUsersResponseDto users = FetchUsersResponseDto.builder()
				.users(List.of(
						User.builder().id(customerId).build(),
						User.builder().id(agentId).build(),
						User.builder().id(resolverId).build()))
				.build();

		when(currentUser.isAdmin()).thenReturn(false);
		when(currentUser.isAgent()).thenReturn(true);
		when(currentUser.userId()).thenReturn(agentId);
		when(claimService.getAllClaimsByAgent(agentId)).thenReturn(List.of(claim));

		when(restClient.post()).thenReturn(requestBodyUriSpec);
		when(requestBodyUriSpec.uri(anyString())).thenReturn(requestBodySpec);
		when(requestBodySpec.body(any(FetchUsersRequestDto.class)))
				.thenReturn(requestBodySpec);
		when(requestBodySpec.retrieve()).thenReturn(responseSpec);
		when(responseSpec.body(FetchUsersResponseDto.class)).thenReturn(users);

		ResponseEntity<APIResponseDto> response = controller.getAllClaims();

		assertEquals(200, response.getStatusCode().value());
		assertNotNull(response.getBody());
		assertNotNull(response.getBody().getBody());

		List<?> body = (List<?>) response.getBody().getBody();
		assertEquals(1, body.size());

		verify(claimService).getAllClaimsByAgent(agentId);
	}

	@Test
	void shouldGetAllClaimsForCustomer() {

		UUID customerId = UUID.randomUUID();
		UUID agentId = UUID.randomUUID();
		UUID resolverId = UUID.randomUUID();

		Claim claim = new Claim();
		claim.setCustomerId(customerId);
		claim.setAgentId(agentId);
		claim.setResolverId(resolverId);
		claim.setProofs(List.of());

		FetchUsersResponseDto users = FetchUsersResponseDto.builder()
				.users(List.of(
						User.builder().id(customerId).build(),
						User.builder().id(agentId).build(),
						User.builder().id(resolverId).build()))
				.build();

		when(currentUser.isAdmin()).thenReturn(false);
		when(currentUser.isAgent()).thenReturn(false);
		when(currentUser.userId()).thenReturn(customerId);
		when(claimService.getAllClaimsByCustomer(customerId)).thenReturn(List.of(claim));

		when(restClient.post()).thenReturn(requestBodyUriSpec);
		when(requestBodyUriSpec.uri(anyString())).thenReturn(requestBodySpec);
		when(requestBodySpec.body(any(FetchUsersRequestDto.class)))
				.thenReturn(requestBodySpec);
		when(requestBodySpec.retrieve()).thenReturn(responseSpec);
		when(responseSpec.body(FetchUsersResponseDto.class)).thenReturn(users);

		ResponseEntity<APIResponseDto> response = controller.getAllClaims();

		assertEquals(200, response.getStatusCode().value());
		assertNotNull(response.getBody());
		assertNotNull(response.getBody().getBody());

		List<?> body = (List<?>) response.getBody().getBody();
		assertEquals(1, body.size());

		verify(claimService).getAllClaimsByCustomer(customerId);
	}
}