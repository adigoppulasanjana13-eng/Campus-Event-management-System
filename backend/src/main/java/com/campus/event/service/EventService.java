package com.campus.event.service;

import com.campus.event.dto.EventRequest;
import com.campus.event.dto.EventResponse;

import java.util.List;

public interface EventService {

    EventResponse createEvent(EventRequest request, String organizerEmail);

    EventResponse updateEvent(Long id, EventRequest request);

    void deleteEvent(Long id);

    EventResponse getEventById(Long id);

    List<EventResponse> getAllEvents(String category, String query);

    List<String> getAllCategories();
}
