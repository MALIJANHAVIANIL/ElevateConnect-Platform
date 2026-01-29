package com.elevate.backend.controller;

import com.elevate.backend.domain.*;
import com.elevate.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {

    private final DriveRepository driveRepository;
    private final StudentProfileRepository profileRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final FeedbackRepository feedbackRepository;
    private final CertificationRepository certificationRepository;

    @GetMapping("/eligible-drives")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Drive>> getEligibleDrives() {
        User currentUser = getCurrentUser();
        StudentProfile profile = profileRepository.findByUser(currentUser)
                .orElseThrow(() -> new RuntimeException("Profile not found. Please complete your profile."));

        List<Drive> allActiveDrives = driveRepository.findByStatus(DriveStatus.ACTIVE);

        // Filter by CGPA (Logic: Drive Min CGPA <= Student CGPA)
        List<Drive> eligibleDrives = allActiveDrives.stream()
                .filter(drive -> drive.getMinCgpa() == null || profile.getCgpa() >= drive.getMinCgpa())
                .collect(Collectors.toList());

        return ResponseEntity.ok(eligibleDrives);
    }

    @PostMapping("/apply/{driveId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Application> applyForDrive(@PathVariable Long driveId) {
        User currentUser = getCurrentUser();
        Drive drive = driveRepository.findById(driveId)
                .orElseThrow(() -> new RuntimeException("Drive not found"));

        if (applicationRepository.existsByStudentAndDrive(currentUser, drive)) {
            throw new RuntimeException("Already applied to this drive");
        }

        Application application = Application.builder()
                .student(currentUser)
                .drive(drive)
                .status(ApplicationStatus.APPLIED) // Default status
                .build();

        return ResponseEntity.ok(applicationRepository.save(application));
    }

    @GetMapping("/my-applications")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Application>> getMyApplications() {
        User currentUser = getCurrentUser();
        return ResponseEntity.ok(applicationRepository.findByStudent(currentUser));
    }

    // --- Growth Loop ---

    @GetMapping("/my-feedback")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Feedback>> getMyFeedback() {
        User currentUser = getCurrentUser();
        return ResponseEntity.ok(feedbackRepository.findByStudent(currentUser));
    }

    @PostMapping("/upload-certificate")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Certification> uploadCertificate(@RequestBody Certification certification) {
        User currentUser = getCurrentUser();
        certification.setStudent(currentUser);
        certification.setStatus(CertificationStatus.PENDING);
        return ResponseEntity.ok(certificationRepository.save(certification));
    }

    @GetMapping("/my-certifications")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Certification>> getMyCertifications() {
        User currentUser = getCurrentUser();
        return ResponseEntity.ok(certificationRepository.findByStudent(currentUser));
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        return userRepository.findByEmail(email).orElseThrow();
    }
}
