package com.hospital.appointment.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hospital.appointment.entity.DoctorAvailability;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DoctorAvailabilityRepository extends JpaRepository<DoctorAvailability, Long> {
    List<DoctorAvailability> findByDoctorIdAndIsBookedFalse(Long doctorId);
    List<DoctorAvailability> findByDoctorIdAndAvailableDateAndIsBookedFalse(
        Long doctorId, LocalDate date);
}
