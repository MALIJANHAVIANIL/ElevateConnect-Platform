package com.elevate.backend.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "drives")
public class Drive {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String companyName;

    @Column(columnDefinition = "TEXT")
    private String jobDescription;

    // Eligibility Criteria
    private Double minCgpa;
    private String eligibleBranches; // Comma separated, e.g. "CSE,ECE"

    @Column(nullable = false)
    private LocalDate deadline;

    private Double ctc;

    @Enumerated(EnumType.STRING)
    private DriveStatus status;
}
