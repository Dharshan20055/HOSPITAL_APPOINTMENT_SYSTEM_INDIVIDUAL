package com.hospital.appointment.serviceImpl;


import org.springframework.stereotype.Service;

import com.hospital.appointment.dto.UserDTO;
import com.hospital.appointment.dto.request.DoctorAvailabilityRequest;
import com.hospital.appointment.entity.DoctorAvailability;
import com.hospital.appointment.entity.User;
import com.hospital.appointment.exception.ResourceNotFoundException;
import com.hospital.appointment.repository.DoctorAvailabilityRepository;
import com.hospital.appointment.repository.UserRepository;
import com.hospital.appointment.service.DoctorService;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {
    
    private final UserRepository userRepository;
    private final DoctorAvailabilityRepository availabilityRepository;
    
    @Override
    public List<UserDTO> getAllDoctors() {
        return userRepository.findByRole(User.Role.DOCTOR)
            .stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<UserDTO> getDoctorsBySpecialization(String specialization) {
        return userRepository.findByRoleAndSpecialization(User.Role.DOCTOR, specialization)
            .stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<DoctorAvailability> getDoctorAvailability(Long doctorId) {
        return availabilityRepository.findByDoctorIdAndIsBookedFalse(doctorId);
    }
    
    @Override
    public DoctorAvailability addAvailability(Long doctorId, DoctorAvailabilityRequest request) {
        User doctor = userRepository.findById(doctorId)
            .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        
        DoctorAvailability availability = new DoctorAvailability();
        availability.setDoctor(doctor);
        availability.setAvailableDate(request.getAvailableDate());
        availability.setStartTime(request.getStartTime());
        availability.setEndTime(request.getEndTime());
        availability.setBooked(false);
        
        return availabilityRepository.save(availability);
    }
    
    @Override
    public Long getDoctorIdByEmail(String email) {
        User doctor = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        return doctor.getId();
    }
    
    private UserDTO mapToDTO(User user) {
        return new UserDTO(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole().name(),
            user.getSpecialization(),
            user.getPhone()
        );
    }
}
