package com.elevate.backend.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "feedbacks")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    // Optional: link to the specific failed application to give context
    @ManyToOne
    @JoinColumn(name = "application_id")
    private Application application;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content; // The actual feedback

    private String courseLink; // The suggested course

    @CreationTimestamp
    private LocalDateTime createdAt;
}
