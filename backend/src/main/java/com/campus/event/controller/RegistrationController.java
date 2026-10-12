package com.campus.event.controller;

import com.campus.event.dto.RegistrationRequest;
import com.campus.event.dto.RegistrationResponse;
import com.campus.event.entity.Role;
import com.campus.event.entity.User;
import com.campus.event.exception.ResourceNotFoundException;
import com.campus.event.repository.UserRepo;
import com.campus.event.service.RegistrationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/registrations")
@CrossOrigin(origins = "*")
public class RegistrationController {

    private final RegistrationService registrationService;
    private final UserRepo userRepo;

    public RegistrationController(RegistrationService registrationService, UserRepo userRepo) {
        this.registrationService = registrationService;
        this.userRepo = userRepo;
    }

    @PostMapping
    public ResponseEntity<RegistrationResponse> registerForEvent(
            @Valid @RequestBody RegistrationRequest request,
            Principal principal) {
        if (request.getUserId() == null && principal != null) {
            User user = userRepo.findByEmail(principal.getName())
                    .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
            request.setUserId(user.getId());
        }

        RegistrationResponse response = registrationService.registerUser(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/my-registrations")
    public ResponseEntity<List<RegistrationResponse>> getMyRegistrations(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User user = userRepo.findByEmail(principal.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));

        List<RegistrationResponse> list = registrationService.getRegistrationsByUser(user.getId());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<RegistrationResponse>> getEventRegistrations(@PathVariable Long eventId) {
        List<RegistrationResponse> list = registrationService.getRegistrationsByEvent(eventId);
        return ResponseEntity.ok(list);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> cancelRegistration(
            @PathVariable Long id,
            Principal principal) {
        Long requestingUserId = null;
        boolean isAdmin = false;

        if (principal != null) {
            User user = userRepo.findByEmail(principal.getName())
                    .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
            requestingUserId = user.getId();
            isAdmin = user.getRole() == Role.ROLE_ADMIN;
        }

        registrationService.cancelRegistration(id, requestingUserId, isAdmin);
        return ResponseEntity.ok(Collections.singletonMap("message", "Registration cancelled successfully"));
    }
}
