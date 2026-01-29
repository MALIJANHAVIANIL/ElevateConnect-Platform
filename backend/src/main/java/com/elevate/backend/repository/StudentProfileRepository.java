package com.elevate.backend.repository;

import com.elevate.backend.domain.StudentProfile;
import com.elevate.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {
    Optional<StudentProfile> findByUser(User user);

    Optional<StudentProfile> findByUserId(Long userId);
}
