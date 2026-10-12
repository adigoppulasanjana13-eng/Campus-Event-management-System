package com.campus.event.dto;

import jakarta.validation.constraints.NotNull;

public class RegistrationRequest {

    private Long userId;

    @NotNull(message = "Event ID is required")
    private Long eventId;

    public RegistrationRequest() {
    }

    public RegistrationRequest(Long userId, Long eventId) {
        this.userId = userId;
        this.eventId = eventId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }
}
