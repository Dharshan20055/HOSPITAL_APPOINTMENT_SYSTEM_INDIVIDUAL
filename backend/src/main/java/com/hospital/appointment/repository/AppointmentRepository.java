package com.hospital.appointment.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hospital.appointment.entity.Appointment;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByDoctorId(Long doctorId);
    List<Appointment> findByDoctorIdAndStatus(Long doctorId, Appointment.Status status);
    
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.doctor.id = :doctorId " +
           "AND a.appointmentDate = :date " +
           "AND ((a.startTime < :endTime AND a.endTime > :startTime)) " +
           "AND a.status IN ('BOOKED', 'CONFIRMED')")
    int countOverlappingAppointments(@Param("doctorId") Long doctorId,
                                     @Param("date") LocalDate date,
                                     @Param("startTime") LocalTime startTime,
                                     @Param("endTime") LocalTime endTime);
    
    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId " +
           "AND a.status = 'COMPLETED' " +
           "ORDER BY a.appointmentDate DESC, a.startTime DESC")
    List<Appointment> findVisitedPatients(@Param("doctorId") Long doctorId);
}
