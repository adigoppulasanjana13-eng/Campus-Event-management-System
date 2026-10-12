package com.campus.event.service;

import com.campus.event.dto.RegistrationRequest;
import com.campus.event.dto.RegistrationResponse;
import com.campus.event.entity.Event;
import com.campus.event.entity.Registration;
import com.campus.event.entity.RegistrationStatus;
import com.campus.event.entity.Role;
import com.campus.event.entity.User;
import com.campus.event.exception.BadRequestException;
import com.campus.event.exception.DuplicateRegistrationException;
import com.campus.event.exception.EventFullException;
import com.campus.event.exception.ResourceNotFoundException;
import com.campus.event.repository.EventRepo;
import com.campus.event.repository.RegistrationRepo;
import com.campus.event.repository.UserRepo;
import com.campus.event.service.impl.RegistrationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RegistrationServiceImplTest {

    @Mock
    private UserRepo userRepo;

    @Mock
    private EventRepo eventRepo;

    @Mock
    private RegistrationRepo registrationRepo;

    @InjectMocks
    private RegistrationServiceImpl registrationService;

    private User sampleUser;
    private Event sampleEvent;
    private RegistrationRequest registrationRequest;

    @BeforeEach
    void setUp() {
        sampleUser = new User();
        sampleUser.setId(1L);
        sampleUser.setName("Jane Doe");
        sampleUser.setEmail("jane.doe@campus.edu");
        sampleUser.setRole(Role.ROLE_STUDENT);
        sampleUser.setDepartment("Computer Science");

        sampleEvent = new Event();
        sampleEvent.setId(10L);
        sampleEvent.setTitle("AI Summit 2026");
        sampleEvent.setLocation("Grand Auditorium");
        sampleEvent.setCategory("Technology");
        sampleEvent.setMaxCapacity(100);
        sampleEvent.setCurrentCapacity(20);
        sampleEvent.setEventDate(LocalDateTime.now().plusDays(10));

        registrationRequest = new RegistrationRequest(1L, 10L);
    }

    @Test
    @DisplayName("Successfully register user when capacity is available and no duplicate registration exists")
    void testRegisterUser_Success() {
        // Given
        when(userRepo.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(eventRepo.findById(10L)).thenReturn(Optional.of(sampleEvent));
        when(registrationRepo.existsByUserIdAndEventIdAndStatus(1L, 10L, RegistrationStatus.REGISTERED))
                .thenReturn(false);

        Registration savedRegistration = new Registration();
        savedRegistration.setId(50L);
        savedRegistration.setUser(sampleUser);
        savedRegistration.setEvent(sampleEvent);
        savedRegistration.setStatus(RegistrationStatus.REGISTERED);
        savedRegistration.setTicketCode("TKT-ABC12345");
        savedRegistration.setRegisteredAt(LocalDateTime.now());

        when(registrationRepo.save(any(Registration.class))).thenReturn(savedRegistration);
        when(eventRepo.save(any(Event.class))).thenReturn(sampleEvent);

        // When
        RegistrationResponse response = registrationService.registerUser(registrationRequest);

        // Then
        assertNotNull(response);
        assertEquals(50L, response.getId());
        assertEquals("Jane Doe", response.getUserName());
        assertEquals("AI Summit 2026", response.getEventTitle());
        assertEquals(RegistrationStatus.REGISTERED, response.getStatus());
        assertEquals(21, sampleEvent.getCurrentCapacity());

        verify(userRepo, times(1)).findById(1L);
        verify(eventRepo, times(1)).findById(10L);
        verify(registrationRepo, times(1)).existsByUserIdAndEventIdAndStatus(1L, 10L, RegistrationStatus.REGISTERED);
        verify(registrationRepo, times(1)).save(any(Registration.class));
        verify(eventRepo, times(1)).save(sampleEvent);
    }

    @Test
    @DisplayName("Fail registration when event capacity is full - throws EventFullException")
    void testRegisterUser_EventFull_ThrowsEventFullException() {
        // Given: event is completely full
        sampleEvent.setMaxCapacity(50);
        sampleEvent.setCurrentCapacity(50);

        when(userRepo.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(eventRepo.findById(10L)).thenReturn(Optional.of(sampleEvent));

        // When & Then
        EventFullException exception = assertThrows(EventFullException.class, () ->
                registrationService.registerUser(registrationRequest)
        );

        assertTrue(exception.getMessage().contains("is full"));
        // Check order: user and event verified, but duplicate check and saves were NEVER invoked
        verify(userRepo, times(1)).findById(1L);
        verify(eventRepo, times(1)).findById(10L);
        verify(registrationRepo, never()).existsByUserIdAndEventIdAndStatus(anyLong(), anyLong(), any());
        verify(registrationRepo, never()).save(any());
        verify(eventRepo, never()).save(any());
    }

    @Test
    @DisplayName("Fail registration when user is already registered - throws DuplicateRegistrationException")
    void testRegisterUser_DuplicateRegistration_ThrowsDuplicateRegistrationException() {
        // Given: event has capacity, but user is already enrolled
        sampleEvent.setMaxCapacity(50);
        sampleEvent.setCurrentCapacity(10);

        when(userRepo.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(eventRepo.findById(10L)).thenReturn(Optional.of(sampleEvent));
        when(registrationRepo.existsByUserIdAndEventIdAndStatus(1L, 10L, RegistrationStatus.REGISTERED))
                .thenReturn(true);

        // When & Then
        DuplicateRegistrationException exception = assertThrows(DuplicateRegistrationException.class, () ->
                registrationService.registerUser(registrationRequest)
        );

        assertTrue(exception.getMessage().contains("is already registered"));
        verify(userRepo, times(1)).findById(1L);
        verify(eventRepo, times(1)).findById(10L);
        verify(registrationRepo, times(1)).existsByUserIdAndEventIdAndStatus(1L, 10L, RegistrationStatus.REGISTERED);
        verify(registrationRepo, never()).save(any());
    }

    @Test
    @DisplayName("Fail registration when user does not exist - throws ResourceNotFoundException")
    void testRegisterUser_UserNotFound_ThrowsResourceNotFoundException() {
        when(userRepo.findById(1L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () ->
                registrationService.registerUser(registrationRequest)
        );

        assertTrue(exception.getMessage().contains("User not found"));
        verify(userRepo, times(1)).findById(1L);
        verify(eventRepo, never()).findById(anyLong());
    }

    @Test
    @DisplayName("Fail registration when event does not exist - throws ResourceNotFoundException")
    void testRegisterUser_EventNotFound_ThrowsResourceNotFoundException() {
        when(userRepo.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(eventRepo.findById(10L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () ->
                registrationService.registerUser(registrationRequest)
        );

        assertTrue(exception.getMessage().contains("Event not found"));
        verify(userRepo, times(1)).findById(1L);
        verify(eventRepo, times(1)).findById(10L);
    }

    @Test
    @DisplayName("Successfully cancel registration and decrement event capacity")
    void testCancelRegistration_Success() {
        sampleEvent.setCurrentCapacity(5);

        Registration reg = new Registration();
        reg.setId(99L);
        reg.setUser(sampleUser);
        reg.setEvent(sampleEvent);
        reg.setStatus(RegistrationStatus.REGISTERED);

        when(registrationRepo.findById(99L)).thenReturn(Optional.of(reg));
        when(registrationRepo.save(any(Registration.class))).thenReturn(reg);
        when(eventRepo.save(any(Event.class))).thenReturn(sampleEvent);

        // When
        registrationService.cancelRegistration(99L, 1L, false);

        // Then
        assertEquals(RegistrationStatus.CANCELLED, reg.getStatus());
        assertEquals(4, sampleEvent.getCurrentCapacity());
        verify(registrationRepo, times(1)).save(reg);
        verify(eventRepo, times(1)).save(sampleEvent);
    }

    @Test
    @DisplayName("Cancel registration fails when already cancelled")
    void testCancelRegistration_AlreadyCancelled_ThrowsBadRequestException() {
        Registration reg = new Registration();
        reg.setId(99L);
        reg.setUser(sampleUser);
        reg.setEvent(sampleEvent);
        reg.setStatus(RegistrationStatus.CANCELLED);

        when(registrationRepo.findById(99L)).thenReturn(Optional.of(reg));

        assertThrows(BadRequestException.class, () ->
                registrationService.cancelRegistration(99L, 1L, false)
        );
    }
}
