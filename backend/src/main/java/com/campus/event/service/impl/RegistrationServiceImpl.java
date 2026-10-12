package com.campus.event.service.impl;

import com.campus.event.dto.RegistrationRequest;
import com.campus.event.dto.RegistrationResponse;
import com.campus.event.entity.Event;
import com.campus.event.entity.Registration;
import com.campus.event.entity.RegistrationStatus;
import com.campus.event.entity.User;
import com.campus.event.exception.BadRequestException;
import com.campus.event.exception.DuplicateRegistrationException;
import com.campus.event.exception.EventFullException;
import com.campus.event.exception.ResourceNotFoundException;
import com.campus.event.repository.EventRepo;
import com.campus.event.repository.RegistrationRepo;
import com.campus.event.repository.UserRepo;
import com.campus.event.service.RegistrationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RegistrationServiceImpl implements RegistrationService {

    private final UserRepo userRepo;
    private final EventRepo eventRepo;
    private final RegistrationRepo registrationRepo;

    public RegistrationServiceImpl(UserRepo userRepo,
                                   EventRepo eventRepo,
                                   RegistrationRepo registrationRepo) {
        this.userRepo = userRepo;
        this.eventRepo = eventRepo;
        this.registrationRepo = registrationRepo;
    }

    /**
     * Atomic registration workflow enforcing strict sequential validations:
     * (1) Verify User existence
     * (2) Verify Event existence
     * (3) Check if current_capacity < max_capacity
     * (4) Check for duplicate registration
     */
    @Override
    @Transactional
    public RegistrationResponse registerUser(RegistrationRequest request) {
        // Step 1: Verify User existence
        User user = userRepo.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        // Step 2: Verify Event existence
        Event event = eventRepo.findById(request.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + request.getEventId()));

        // Step 3: Check if current_capacity < max_capacity
        int currentCapacity = event.getCurrentCapacity() != null ? event.getCurrentCapacity() : 0;
        int maxCapacity = event.getMaxCapacity() != null ? event.getMaxCapacity() : 0;
        if (currentCapacity >= maxCapacity) {
            throw new EventFullException(
                    String.format("Event '%s' is full (Capacity: %d/%d). Registrations closed.",
                            event.getTitle(), currentCapacity, maxCapacity)
            );
        }

        // Step 4: Check for duplicate registration
        boolean alreadyRegistered = registrationRepo.existsByUserIdAndEventIdAndStatus(
                user.getId(),
                event.getId(),
                RegistrationStatus.REGISTERED
        );
        if (alreadyRegistered) {
            throw new DuplicateRegistrationException(
                    String.format("User '%s' is already registered for event '%s'.",
                            user.getName(), event.getTitle())
            );
        }

        // Atomically create and persist registration
        Registration registration = new Registration();
        registration.setUser(user);
        registration.setEvent(event);
        registration.setStatus(RegistrationStatus.REGISTERED);
        registration.setTicketCode("TKT-" + UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase());
        registration.setRegisteredAt(LocalDateTime.now());

        Registration savedRegistration = registrationRepo.save(registration);

        // Increment event registered count
        event.setCurrentCapacity(currentCapacity + 1);
        eventRepo.save(event);

        return RegistrationResponse.fromEntity(savedRegistration);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RegistrationResponse> getRegistrationsByUser(Long userId) {
        if (!userRepo.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        return registrationRepo.findByUserIdOrderByRegisteredAtDesc(userId)
                .stream()
                .map(RegistrationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<RegistrationResponse> getRegistrationsByEvent(Long eventId) {
        if (!eventRepo.existsById(eventId)) {
            throw new ResourceNotFoundException("Event not found with id: " + eventId);
        }
        return registrationRepo.findByEventIdOrderByRegisteredAtDesc(eventId)
                .stream()
                .map(RegistrationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void cancelRegistration(Long registrationId, Long requestingUserId, boolean isAdmin) {
        Registration registration = registrationRepo.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with id: " + registrationId));

        if (!isAdmin && (requestingUserId == null || !registration.getUser().getId().equals(requestingUserId))) {
            throw new BadRequestException("You are not authorized to cancel this registration");
        }

        if (registration.getStatus() == RegistrationStatus.CANCELLED) {
            throw new BadRequestException("Registration has already been cancelled");
        }

        registration.setStatus(RegistrationStatus.CANCELLED);
        registrationRepo.save(registration);

        Event event = registration.getEvent();
        if (event != null && event.getCurrentCapacity() != null && event.getCurrentCapacity() > 0) {
            event.setCurrentCapacity(event.getCurrentCapacity() - 1);
            eventRepo.save(event);
        }
    }
}
