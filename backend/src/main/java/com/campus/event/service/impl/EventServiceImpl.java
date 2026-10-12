package com.campus.event.service.impl;

import com.campus.event.dto.EventRequest;
import com.campus.event.dto.EventResponse;
import com.campus.event.entity.Event;
import com.campus.event.entity.User;
import com.campus.event.exception.BadRequestException;
import com.campus.event.exception.ResourceNotFoundException;
import com.campus.event.repository.EventRepo;
import com.campus.event.repository.UserRepo;
import com.campus.event.service.EventService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventServiceImpl implements EventService {

    private final EventRepo eventRepo;
    private final UserRepo userRepo;

    public EventServiceImpl(EventRepo eventRepo, UserRepo userRepo) {
        this.eventRepo = eventRepo;
        this.userRepo = userRepo;
    }

    @Override
    @Transactional
    public EventResponse createEvent(EventRequest request, String organizerEmail) {
        User organizer = null;
        if (organizerEmail != null) {
            organizer = userRepo.findByEmail(organizerEmail).orElse(null);
        }

        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
        event.setCategory(request.getCategory());
        event.setEventDate(request.getEventDate());
        event.setMaxCapacity(request.getMaxCapacity());
        event.setCurrentCapacity(0);
        event.setBannerUrl(request.getBannerUrl());
        event.setOrganizer(organizer);

        Event savedEvent = eventRepo.save(event);
        return EventResponse.fromEntity(savedEvent);
    }

    @Override
    @Transactional
    public EventResponse updateEvent(Long id, EventRequest request) {
        Event event = eventRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

        if (request.getMaxCapacity() < event.getCurrentCapacity()) {
            throw new BadRequestException("Max capacity cannot be lower than current registered count (" + event.getCurrentCapacity() + ")");
        }

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
        event.setCategory(request.getCategory());
        event.setEventDate(request.getEventDate());
        event.setMaxCapacity(request.getMaxCapacity());
        if (request.getBannerUrl() != null) {
            event.setBannerUrl(request.getBannerUrl());
        }

        Event updatedEvent = eventRepo.save(event);
        return EventResponse.fromEntity(updatedEvent);
    }

    @Override
    @Transactional
    public void deleteEvent(Long id) {
        Event event = eventRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        eventRepo.delete(event);
    }

    @Override
    @Transactional(readOnly = true)
    public EventResponse getEventById(Long id) {
        Event event = eventRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        return EventResponse.fromEntity(event);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventResponse> getAllEvents(String category, String query) {
        List<Event> events;
        boolean hasCategory = category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("all");
        boolean hasQuery = query != null && !query.trim().isEmpty();

        if (hasCategory && hasQuery) {
            events = eventRepo.filterEvents(category.trim(), query.trim());
        } else if (hasCategory) {
            events = eventRepo.findByCategoryIgnoreCaseOrderByEventDateAsc(category.trim());
        } else if (hasQuery) {
            events = eventRepo.searchEvents(query.trim());
        } else {
            events = eventRepo.findAllByOrderByEventDateAsc();
        }

        return events.stream()
                .map(EventResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getAllCategories() {
        return eventRepo.findDistinctCategories();
    }
}
