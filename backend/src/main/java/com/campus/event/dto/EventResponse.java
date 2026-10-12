package com.campus.event.dto;

import com.campus.event.entity.Event;

import java.time.LocalDateTime;

public class EventResponse {

    private Long id;
    private String title;
    private String description;
    private String location;
    private String category;
    private LocalDateTime eventDate;
    private Integer maxCapacity;
    private Integer currentCapacity;
    private String bannerUrl;
    private Long organizerId;
    private String organizerName;
    private String organizerEmail;
    private boolean isFull;
    private LocalDateTime createdAt;

    public EventResponse() {
    }

    public static EventResponse fromEntity(Event event) {
        if (event == null) {
            return null;
        }
        EventResponse response = new EventResponse();
        response.setId(event.getId());
        response.setTitle(event.getTitle());
        response.setDescription(event.getDescription());
        response.setLocation(event.getLocation());
        response.setCategory(event.getCategory());
        response.setEventDate(event.getEventDate());
        response.setMaxCapacity(event.getMaxCapacity());
        response.setCurrentCapacity(event.getCurrentCapacity() != null ? event.getCurrentCapacity() : 0);
        response.setBannerUrl(event.getBannerUrl());
        response.setCreatedAt(event.getCreatedAt());
        response.setFull(response.getCurrentCapacity() >= response.getMaxCapacity());

        if (event.getOrganizer() != null) {
            response.setOrganizerId(event.getOrganizer().getId());
            response.setOrganizerName(event.getOrganizer().getName());
            response.setOrganizerEmail(event.getOrganizer().getEmail());
        }

        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public LocalDateTime getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDateTime eventDate) {
        this.eventDate = eventDate;
    }

    public Integer getMaxCapacity() {
        return maxCapacity;
    }

    public void setMaxCapacity(Integer maxCapacity) {
        this.maxCapacity = maxCapacity;
    }

    public Integer getCurrentCapacity() {
        return currentCapacity;
    }

    public void setCurrentCapacity(Integer currentCapacity) {
        this.currentCapacity = currentCapacity;
    }

    public String getBannerUrl() {
        return bannerUrl;
    }

    public void setBannerUrl(String bannerUrl) {
        this.bannerUrl = bannerUrl;
    }

    public Long getOrganizerId() {
        return organizerId;
    }

    public void setOrganizerId(Long organizerId) {
        this.organizerId = organizerId;
    }

    public String getOrganizerName() {
        return organizerName;
    }

    public void setOrganizerName(String organizerName) {
        this.organizerName = organizerName;
    }

    public String getOrganizerEmail() {
        return organizerEmail;
    }

    public void setOrganizerEmail(String organizerEmail) {
        this.organizerEmail = organizerEmail;
    }

    public boolean isFull() {
        return isFull;
    }

    public void setFull(boolean full) {
        isFull = full;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
