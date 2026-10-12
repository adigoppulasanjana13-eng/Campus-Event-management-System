package com.campus.event.service;

import com.campus.event.dto.RegistrationRequest;
import com.campus.event.dto.RegistrationResponse;

import java.util.List;

public interface RegistrationService {

    RegistrationResponse registerUser(RegistrationRequest request);

    List<RegistrationResponse> getRegistrationsByUser(Long userId);

    List<RegistrationResponse> getRegistrationsByEvent(Long eventId);

    void cancelRegistration(Long registrationId, Long requestingUserId, boolean isAdmin);
}
