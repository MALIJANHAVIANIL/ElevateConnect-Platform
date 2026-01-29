package com.elevate.backend.controller;

import com.elevate.backend.domain.Application;
import com.elevate.backend.domain.ApplicationStatus;
import com.elevate.backend.domain.Drive;
import com.elevate.backend.domain.DriveStatus;
import com.elevate.backend.domain.*;
import com.elevate.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tpo")
@RequiredArgsConstructor
public class TPOController {

    private final DriveRepository driveRepository;
    private final ApplicationRepository applicationRepository;
    private final FeedbackRepository feedbackRepository;
    private final CertificationRepository certificationRepository;
    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;

    @PostMapping("/drives")
    @PreAuthorize("hasRole('TPO')")
    public ResponseEntity<Drive> createDrive(@RequestBody Drive drive) {
        drive.setStatus(DriveStatus.ACTIVE);
        return ResponseEntity.ok(driveRepository.save(drive));
    }

    @GetMapping("/drives")
    @PreAuthorize("hasRole('TPO')")
    public ResponseEntity<List<Drive>> getAllDrives() {
        return ResponseEntity.ok(driveRepository.findAll());
    }

    @PutMapping("/drives/{id}/status")
    @PreAuthorize("hasRole('TPO')")
    public ResponseEntity<Drive> updateDriveStatus(@PathVariable Long id, @RequestParam DriveStatus status) {
        Drive drive = driveRepository.findById(id).orElseThrow();
        drive.setStatus(status);
        return ResponseEntity.ok(driveRepository.save(drive));
    }

    @GetMapping("/drives/{driveId}/applications")
    @PreAuthorize("hasRole('TPO')")
    public ResponseEntity<List<Application>> getApplicationsForDrive(@PathVariable Long driveId) {
        Drive drive = driveRepository.findById(driveId).orElseThrow();
        return ResponseEntity.ok(applicationRepository.findByDrive(drive));
    }

    @PutMapping("/applications/{applicationId}/status")
    @PreAuthorize("hasRole('TPO')")
    public ResponseEntity<Application> updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestParam ApplicationStatus status) {
        Application application = applicationRepository.findById(applicationId).orElseThrow();
        application.setStatus(status);
        return ResponseEntity.ok(applicationRepository.save(application));
    }

    @PostMapping("/feedback")
    @PreAuthorize("hasRole('TPO')")
    public ResponseEntity<Feedback> assignFeedback(@RequestBody Feedback feedback) {
        // Ensure student exists (assuming student ID is passed in feedback.student)
        if (feedback.getStudent() == null || feedback.getStudent().getId() == null) {
            throw new RuntimeException("Student ID is required");
        }
        User student = userRepository.findById(feedback.getStudent().getId()).orElseThrow();
        feedback.setStudent(student);
        return ResponseEntity.ok(feedbackRepository.save(feedback));
    }

    @GetMapping("/certifications/pending")
    @PreAuthorize("hasRole('TPO')")
    public ResponseEntity<List<Certification>> getPendingCertifications() {
        return ResponseEntity.ok(certificationRepository.findByStatus(CertificationStatus.PENDING));
    }

    @PutMapping("/certifications/{id}/verify")
    @PreAuthorize("hasRole('TPO')")
    public ResponseEntity<Certification> verifyCertification(@PathVariable Long id) {
        Certification cert = certificationRepository.findById(id).orElseThrow();
        cert.setStatus(CertificationStatus.VERIFIED);

        // Growth Loop Logic: Restore Student
        if (cert.getStudent() != null) {
            StudentProfile profile = studentProfileRepository.findByUser(cert.getStudent())
                    .orElse(new StudentProfile()); // Handle case if profile missing? Or throw?
            if (profile.getUser() == null) {
                // If new profile
                profile.setUser(cert.getStudent());
            }
            profile.setRestored(true);
            studentProfileRepository.save(profile);
        }

        return ResponseEntity.ok(certificationRepository.save(cert));
    }
}
