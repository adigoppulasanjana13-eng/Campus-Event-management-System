package com.campus.event.config;

import com.campus.event.entity.Event;
import com.campus.event.entity.Role;
import com.campus.event.entity.User;
import com.campus.event.repository.EventRepo;
import com.campus.event.repository.UserRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Configuration
public class AppConfig {

    private static final Logger log = LoggerFactory.getLogger(AppConfig.class);

    @Bean
    public CommandLineRunner initDatabase(UserRepo userRepo, EventRepo eventRepo, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepo.count() == 0) {
                log.info("Bootstrapping initial users into Campus Event Management System...");

                User admin = new User();
                admin.setName("Dean of Student Affairs");
                admin.setEmail("admin@campus.edu");
                admin.setPassword(passwordEncoder.encode("Admin@123"));
                admin.setRole(Role.ROLE_ADMIN);
                admin.setDepartment("Campus Administration");
                admin.setStudentId("ADMIN-001");
                admin = userRepo.save(admin);

                User student = new User();
                student.setName("Alex Rivera");
                student.setEmail("alex.rivera@campus.edu");
                student.setPassword(passwordEncoder.encode("Student@123"));
                student.setRole(Role.ROLE_STUDENT);
                student.setDepartment("Computer Science");
                student.setStudentId("CS-2024-8841");
                userRepo.save(student);

                User student2 = new User();
                student2.setName("Samantha Lee");
                student2.setEmail("samantha.lee@campus.edu");
                student2.setPassword(passwordEncoder.encode("Student@123"));
                student2.setRole(Role.ROLE_STUDENT);
                student2.setDepartment("Mechanical Engineering");
                student2.setStudentId("ME-2024-5102");
                userRepo.save(student2);

                log.info("Users initialized: Admin (admin@campus.edu / Admin@123), Student (alex.rivera@campus.edu / Student@123)");

                if (eventRepo.count() == 0) {
                    log.info("Bootstrapping initial campus events...");

                    Event event1 = new Event();
                    event1.setTitle("National Campus Hackathon 2026");
                    event1.setDescription("A 36-hour sprint building real-world AI, Web3, and IoT solutions with industry mentors, food, and $15,000 in grand prizes.");
                    event1.setLocation("Turing Innovation Hub, 3rd Floor");
                    event1.setCategory("Hackathon");
                    event1.setEventDate(LocalDateTime.now().plusDays(14).withHour(9).withMinute(0));
                    event1.setMaxCapacity(120);
                    event1.setCurrentCapacity(0);
                    event1.setBannerUrl("https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80");
                    event1.setOrganizer(admin);
                    eventRepo.save(event1);

                    Event event2 = new Event();
                    event2.setTitle("Autonomous Robotics & Drone Showcase");
                    event2.setDescription("Hands-on aerial robotics and ground rover demonstrations led by the Mechatronics Guild. Live obstacle courses and flight trials.");
                    event2.setLocation("Engineering Quadrangle Arena");
                    event2.setCategory("Workshop");
                    event2.setEventDate(LocalDateTime.now().plusDays(21).withHour(14).withMinute(30));
                    event2.setMaxCapacity(80);
                    event2.setCurrentCapacity(0);
                    event2.setBannerUrl("https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80");
                    event2.setOrganizer(admin);
                    eventRepo.save(event2);

                    Event event3 = new Event();
                    event3.setTitle("Spring Cultural Gala & Acoustic Night");
                    event3.setDescription("A celebration of international music, classical dance, indie rock bands, and multi-cuisine food trucks under the stars.");
                    event3.setLocation("Grand Open Air Amphitheater");
                    event3.setCategory("Cultural");
                    event3.setEventDate(LocalDateTime.now().plusDays(28).withHour(18).withMinute(0));
                    event3.setMaxCapacity(350);
                    event3.setCurrentCapacity(0);
                    event3.setBannerUrl("https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80");
                    event3.setOrganizer(admin);
                    eventRepo.save(event3);

                    Event event4 = new Event();
                    event4.setTitle("Quantum Computing & LLM Research Seminar");
                    event4.setDescription("Keynote lecture by Dr. Elena Vance exploring quantum error correction and tensor network architectures in modern foundation models.");
                    event4.setLocation("Auditorium Hall B");
                    event4.setCategory("Seminar");
                    event4.setEventDate(LocalDateTime.now().plusDays(7).withHour(11).withMinute(0));
                    event4.setMaxCapacity(90);
                    event4.setCurrentCapacity(0);
                    event4.setBannerUrl("https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80");
                    event4.setOrganizer(admin);
                    eventRepo.save(event4);

                    Event event5 = new Event();
                    event5.setTitle("Inter-Collegiate 3v3 Basketball Tournament");
                    event5.setDescription("Competitive bracket tournament with 16 top teams, slam dunk contest, custom team jerseys, and varsity scouting.");
                    event5.setLocation("Recreation & Sports Complex Court 1");
                    event5.setCategory("Sports");
                    event5.setEventDate(LocalDateTime.now().plusDays(10).withHour(16).withMinute(0));
                    event5.setMaxCapacity(50);
                    event5.setCurrentCapacity(0);
                    event5.setBannerUrl("https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80");
                    event5.setOrganizer(admin);
                    eventRepo.save(event5);

                    log.info("Initial events successfully populated!");
                }
            }
        };
    }
}
