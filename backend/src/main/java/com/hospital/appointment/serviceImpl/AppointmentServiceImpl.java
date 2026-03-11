package com.hospital.appointment.serviceImpl;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hospital.appointment.dto.request.AppointmentRequest;
import com.hospital.appointment.dto.response.AppointmentResponse;
import com.hospital.appointment.dto.response.PatientHistoryDTO;
import com.hospital.appointment.entity.Appointment;
import com.hospital.appointment.entity.User;
import com.hospital.appointment.exception.AppointmentConflictException;
import com.hospital.appointment.exception.ResourceNotFoundException;
import com.hospital.appointment.repository.AppointmentRepository;
import com.hospital.appointment.repository.UserRepository;
import com.hospital.appointment.service.AppointmentService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {
    
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    
    @Override
    @Transactional
    public AppointmentResponse bookAppointment(Long patientId, AppointmentRequest request) {
        int overlappingCount = appointmentRepository.countOverlappingAppointments(
            request.getDoctorId(),
            request.getAppointmentDate(),
            request.getStartTime(),
            request.getEndTime()
        );
        
        if (overlappingCount > 0) {
            throw new AppointmentConflictException("Time slot is not available");
        }
        
        User patient = userRepository.findById(patientId)
            .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        User doctor = userRepository.findById(request.getDoctorId())
            .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        
        if (doctor.getRole() != User.Role.DOCTOR) {
            throw new IllegalArgumentException("User is not a doctor");
        }
        
        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setStartTime(request.getStartTime());
        appointment.setEndTime(request.getEndTime());
        appointment.setStatus(Appointment.Status.BOOKED);
        
        Appointment saved = appointmentRepository.save(appointment);
        return mapToResponse(saved);
    }
    
    @Override
    public List<AppointmentResponse> getPatientAppointments(Long patientId) {
        return appointmentRepository.findByPatientId(patientId)
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<AppointmentResponse> getDoctorAppointments(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId)
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public AppointmentResponse confirmAppointment(Long appointmentId, Long doctorId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        
        if (!appointment.getDoctor().getId().equals(doctorId)) {
            throw new IllegalArgumentException("Not authorized to confirm this appointment");
        }
        
        appointment.setStatus(Appointment.Status.CONFIRMED);
        return mapToResponse(appointmentRepository.save(appointment));
    }
    
    @Override
    @Transactional
    public AppointmentResponse completeAppointment(Long appointmentId, Long doctorId, String notes) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        
        if (!appointment.getDoctor().getId().equals(doctorId)) {
            throw new IllegalArgumentException("Not authorized to complete this appointment");
        }
        
        appointment.setStatus(Appointment.Status.COMPLETED);
        appointment.setNotes(notes);
        return mapToResponse(appointmentRepository.save(appointment));
    }
    
    @Override
    @Transactional
    public AppointmentResponse cancelAppointment(Long appointmentId, Long userId, String role) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        
        boolean canCancel = false;
        
        if ("PATIENT".equals(role) && appointment.getPatient().getId().equals(userId) 
            && appointment.getStatus() == Appointment.Status.BOOKED) {
            canCancel = true;
        } else if ("ADMIN".equals(role)) {
            canCancel = true;
        } else if ("DOCTOR".equals(role) && appointment.getDoctor().getId().equals(userId)
            && appointment.getStatus() == Appointment.Status.BOOKED) {
            canCancel = true;
        }
        
        if (!canCancel) {
            throw new IllegalArgumentException("Not authorized to cancel this appointment");
        }
        
        appointment.setStatus(Appointment.Status.CANCELLED);
        return mapToResponse(appointmentRepository.save(appointment));
    }
    
    @Override
    public List<PatientHistoryDTO> getVisitedPatients(Long doctorId) {
        return appointmentRepository.findVisitedPatients(doctorId)
            .stream()
            .map(a -> new PatientHistoryDTO(
                a.getId(),
                a.getPatient().getId(),
                a.getPatient().getName(),
                a.getPatient().getEmail(),
                a.getPatient().getPhone(),
                a.getAppointmentDate(),
                a.getStartTime(),
                a.getEndTime(),
                a.getStatus().name(),
                a.getDepartment() != null ? a.getDepartment().getName() : null,
                a.getNotes()
            ))
            .collect(Collectors.toList());
    }
    
    private AppointmentResponse mapToResponse(Appointment a) {
        return new AppointmentResponse(
            a.getId(),
            a.getPatient().getId(),
            a.getPatient().getName(),
            a.getDoctor().getId(),
            a.getDoctor().getName(),
            a.getAppointmentDate(),
            a.getStartTime(),
            a.getEndTime(),
            a.getStatus().name(),
            a.getCreatedAt()
        );
    }
}
