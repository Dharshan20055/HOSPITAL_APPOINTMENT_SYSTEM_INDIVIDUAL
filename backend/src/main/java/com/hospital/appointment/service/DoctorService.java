package com.hospital.appointment.service;


import java.util.List;

import com.hospital.appointment.dto.UserDTO;
import com.hospital.appointment.dto.request.DoctorAvailabilityRequest;
import com.hospital.appointment.entity.DoctorAvailability;

public interface DoctorService {
    List<UserDTO> getAllDoctors();
    List<UserDTO> getDoctorsBySpecialization(String specialization);
    List<DoctorAvailability> getDoctorAvailability(Long doctorId);
    DoctorAvailability addAvailability(Long doctorId, DoctorAvailabilityRequest request);
    Long getDoctorIdByEmail(String email);
}
