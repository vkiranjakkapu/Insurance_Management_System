package com.ims.identity.dto;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record NomineeCreationRequestDto(
		@NotNull @NotEmpty List<NomineeRequestDto> nominees) {

}
