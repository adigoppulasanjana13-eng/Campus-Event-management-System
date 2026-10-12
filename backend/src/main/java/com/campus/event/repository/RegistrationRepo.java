package com.campus.event.repository;

import com.campus.event.entity.Registration;
import com.campus.event.entity.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepo extends JpaRepository<Registration, Long> {

    List<Registration> findByUserIdOrderByRegisteredAtDesc(Long userId);

    List<Registration> findByEventIdOrderByRegisteredAtDesc(Long eventId);

    boolean existsByUserIdAndEventId(Long userId, Long eventId);

    boolean existsByUserIdAndEventIdAndStatus(Long userId, Long eventId, RegistrationStatus status);

    Optional<Registration> findByUserIdAndEventId(Long userId, Long eventId);

    Optional<Registration> findByTicketCode(String ticketCode);

    long countByEventIdAndStatus(Long eventId, RegistrationStatus status);
}
