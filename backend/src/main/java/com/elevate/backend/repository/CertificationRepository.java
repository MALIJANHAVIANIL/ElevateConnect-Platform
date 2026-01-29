package com.elevate.backend.repository;

import com.elevate.backend.domain.Certification;
import com.elevate.backend.domain.CertificationStatus;
import com.elevate.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CertificationRepository extends JpaRepository<Certification, Long> {
    List<Certification> findByStudent(User student);

    List<Certification> findByStatus(CertificationStatus status);
}
