package com.elevate.backend.repository;

import com.elevate.backend.domain.Application;
import com.elevate.backend.domain.Drive;
import com.elevate.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudent(User student);

    List<Application> findByDrive(Drive drive);

    boolean existsByStudentAndDrive(User student, Drive drive);
}
