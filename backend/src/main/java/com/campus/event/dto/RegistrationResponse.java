package com.campus.event.dto;

import com.campus.event.entity.Registration;
import com.campus.event.entity.RegistrationStatus;

import java.time.LocalDateTime;

public class RegistrationResponse {

    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private String department;
    private String studentId;
    private Long eventId;
    private String eventTitle;
    private String eventLocation;
    private LocalDateTime eventDate;
    private LocalDateTime registeredAt;
    private RegistrationStatus status;
    private String ticketCode;

    public RegistrationResponse() {
    }

    public static RegistrationResponse fromEntity(Registration registration) {
        if (registration == null) {
            return null;
        }
        RegistrationResponse response = new RegistrationResponse();
        response.setId(registration.getId());
        response.setStatus(registration.getStatus());
        response.setTicketCode(registration.getTicketCode());
        response.setRegisteredAt(registration.getRegisteredAt());

        if (registration.getUser() != null) {
            response.setUserId(registration.getUser().getId());
            response.setUserName(registration.getUser().getName());
            response.setUserEmail(registration.getUser().getEmail());
            response.setDepartment(registration.getUser().getDepartment());
            response.setStudentId(registration.getUser().getStudentId());
        }

        if (registration.getEvent() != null) {
            response.setEventId(registration.getEvent().getId());
            response.setEventTitle(registration.getEvent().getTitle());
            response.setEventLocation(registration.getEvent().getLocation());
            response.setEventDate(registration.getEvent().getEventDate());
        }

        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public String getEventTitle() {
        return eventTitle;
    }

    public void setEventTitle(String eventTitle) {
        this.eventTitle = eventTitle;
    }

    public String getEventLocation() {
        return eventLocation;
    }

    public void setEventLocation(String eventLocation) {
        this.eventLocation = eventLocation;
    }

    public LocalDateTime getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDateTime eventDate) {
        this.eventDate = eventDate;
    }

    public LocalDateTime getRegisteredAt() {
        return registeredAt;
    }

    public void setRegisteredAt(LocalDateTime registeredAt) {
        this.registeredAt = registeredAt;
    }

    public RegistrationStatus getStatus() {
        return status;
    }

    public void setStatus(RegistrationStatus status) {
        this.status = status;
    }

    public String getTicketCode() {
        return ticketCode;
    }

    public void setTicketCode(String ticketCode) {
        this.ticketCode = ticketCode;
    }
}
