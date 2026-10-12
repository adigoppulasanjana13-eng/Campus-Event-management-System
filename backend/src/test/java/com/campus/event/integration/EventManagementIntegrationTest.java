package com.campus.event.integration;

import com.campus.event.dto.AuthRequest;
import com.campus.event.dto.EventRequest;
import com.campus.event.dto.RegisterRequest;
import com.campus.event.dto.RegistrationRequest;
import com.campus.event.entity.Event;
import com.campus.event.entity.Registration;
import com.campus.event.entity.RegistrationStatus;
import com.campus.event.entity.Role;
import com.campus.event.repository.EventRepo;
import com.campus.event.repository.RegistrationRepo;
import com.campus.event.repository.UserRepo;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class EventManagementIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private EventRepo eventRepo;

    @Autowired
    private RegistrationRepo registrationRepo;

    @BeforeEach
    void cleanDatabase() {
        registrationRepo.deleteAll();
        eventRepo.deleteAll();
        userRepo.deleteAll();
    }

    @Test
    @DisplayName("End-to-End flow: Register -> Login -> Create Event -> Register User -> Duplicate Check -> Cancel")
    void testCompleteEventManagementWorkflow() throws Exception {
        // Step 1: Register an Admin user
        RegisterRequest adminRegister = new RegisterRequest(
                "Prof. Charles Xavier",
                "charles.xavier@campus.edu",
                "AdminSecure#2026",
                Role.ROLE_ADMIN,
                "Cybernetics",
                "ADMIN-X1"
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(adminRegister)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.role").value("ROLE_ADMIN"));

        // Step 2: Login Admin to acquire JWT
        AuthRequest adminLogin = new AuthRequest("charles.xavier@campus.edu", "AdminSecure#2026");
        MvcResult adminLoginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(adminLogin)))
                .andExpect(status().isOk())
                .andReturn();

        String adminToken = objectMapper.readTree(adminLoginResult.getResponse().getContentAsString())
                .get("token").asText();

        // Step 3: Register a Student user
        RegisterRequest studentRegister = new RegisterRequest(
                "Peter Parker",
                "peter.parker@campus.edu",
                "SpiderWeb#2026",
                Role.ROLE_STUDENT,
                "Biophysics",
                "ST-90021"
        );

        MvcResult studentRegisterResult = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(studentRegister)))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode studentJson = objectMapper.readTree(studentRegisterResult.getResponse().getContentAsString());
        String studentToken = studentJson.get("token").asText();
        Long studentId = studentJson.get("id").asLong();

        // Step 4: Admin creates a new Event
        EventRequest eventRequest = new EventRequest(
                "Annual Quantum Robotics Expo",
                "An inter-collegiate showcase of autonomous micro-rovers and drone swarm logic.",
                "Engineering Quad - Hall 4",
                "Robotics",
                LocalDateTime.now().plusDays(15),
                10,
                "https://images.unsplash.com/photo-1485827404703-89b55fcc595e"
        );

        MvcResult eventResult = mockMvc.perform(post("/api/events")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(eventRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.title").value("Annual Quantum Robotics Expo"))
                .andExpect(jsonPath("$.currentCapacity").value(0))
                .andExpect(jsonPath("$.maxCapacity").value(10))
                .andReturn();

        Long eventId = objectMapper.readTree(eventResult.getResponse().getContentAsString()).get("id").asLong();

        // Step 5: Public event listing (No auth required)
        mockMvc.perform(get("/api/events"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].title").value("Annual Quantum Robotics Expo"));

        // Step 6: Student registers for the event
        RegistrationRequest regRequest = new RegistrationRequest(studentId, eventId);

        MvcResult regResult = mockMvc.perform(post("/api/registrations")
                        .header("Authorization", "Bearer " + studentToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(regRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.ticketCode").isNotEmpty())
                .andExpect(jsonPath("$.status").value("REGISTERED"))
                .andReturn();

        Long registrationId = objectMapper.readTree(regResult.getResponse().getContentAsString()).get("id").asLong();

        // Verify Event capacity in database updated to 1
        Event dbEvent = eventRepo.findById(eventId).orElseThrow();
        assertEquals(1, dbEvent.getCurrentCapacity());

        // Step 7: Duplicate registration attempt by same student MUST fail with 400
        mockMvc.perform(post("/api/registrations")
                        .header("Authorization", "Bearer " + studentToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(regRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("already registered")));

        // Step 8: Query student's registrations
        mockMvc.perform(get("/api/registrations/my-registrations")
                        .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].eventTitle").value("Annual Quantum Robotics Expo"));

        // Step 9: Cancel registration
        mockMvc.perform(delete("/api/registrations/" + registrationId)
                        .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Registration cancelled successfully"));

        // Verify registration status in DB is CANCELLED and event capacity is decremented back to 0
        Registration dbReg = registrationRepo.findById(registrationId).orElseThrow();
        assertEquals(RegistrationStatus.CANCELLED, dbReg.getStatus());

        Event dbEventAfterCancel = eventRepo.findById(eventId).orElseThrow();
        assertEquals(0, dbEventAfterCancel.getCurrentCapacity());
    }
}
