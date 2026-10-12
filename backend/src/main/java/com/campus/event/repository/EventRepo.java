package com.campus.event.repository;

import com.campus.event.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepo extends JpaRepository<Event, Long> {

    List<Event> findAllByOrderByEventDateAsc();

    List<Event> findByCategoryIgnoreCaseOrderByEventDateAsc(String category);

    @Query("SELECT e FROM Event e WHERE " +
           "LOWER(e.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.location) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "ORDER BY e.eventDate ASC")
    List<Event> searchEvents(@Param("query") String query);

    @Query("SELECT e FROM Event e WHERE " +
           "(:category IS NULL OR LOWER(e.category) = LOWER(:category)) AND " +
           "(:query IS NULL OR LOWER(e.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(e.location) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "ORDER BY e.eventDate ASC")
    List<Event> filterEvents(@Param("category") String category, @Param("query") String query);

    List<Event> findByEventDateAfterOrderByEventDateAsc(LocalDateTime dateTime);

    @Query("SELECT DISTINCT e.category FROM Event e ORDER BY e.category ASC")
    List<String> findDistinctCategories();
}
