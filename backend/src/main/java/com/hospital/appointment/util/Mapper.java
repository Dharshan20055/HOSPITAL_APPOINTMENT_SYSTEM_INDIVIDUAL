package com.hospital.appointment.util;


import org.springframework.stereotype.Component;

import com.hospital.appointment.dto.UserDTO;
import com.hospital.appointment.dto.response.AppointmentResponse;
import com.hospital.appointment.dto.response.DoctorResponse;
import com.hospital.appointment.entity.Appointment;
import com.hospital.appointment.entity.User;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class Mapper {
    
    /**
     * Convert User entity to UserDTO
     */
    public UserDTO toUserDTO(User user) {
        if (user == null) return null;
        return new UserDTO(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole().name(),
            user.getSpecialization(),
            user.getPhone()
        );
    }
    
    /**
     * Convert List of User entities to List of UserDTOs
     */
    public List<UserDTO> toUserDTOList(List<User> users) {
        if (users == null) return null;
        return users.stream()
            .map(this::toUserDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Convert Appointment entity to AppointmentResponse
     */
    public AppointmentResponse toAppointmentResponse(Appointment appointment) {
        if (appointment == null) return null;
        return new AppointmentResponse(
            appointment.getId(),
            appointment.getPatient().getId(),
            appointment.getPatient().getName(),
            appointment.getDoctor().getId(),
            appointment.getDoctor().getName(),
            appointment.getAppointmentDate(),
            appointment.getStartTime(),
            appointment.getEndTime(),
            appointment.getStatus().name(),
            appointment.getCreatedAt()
        );
    }
    
    /**
     * Convert List of Appointment entities to List of AppointmentResponses
     */
    public List<AppointmentResponse> toAppointmentResponseList(List<Appointment> appointments) {
        if (appointments == null) return null;
        return appointments.stream()
            .map(this::toAppointmentResponse)
            .collect(Collectors.toList());
    }
    
    /**
     * Convert User entity to DoctorResponse
     */
    public DoctorResponse toDoctorResponse(User doctor, int totalAppointments, 
                                           int completedAppointments, String availabilityStatus) {
        if (doctor == null) return null;
        return new DoctorResponse(
            doctor.getId(),
            doctor.getName(),
            doctor.getEmail(),
            doctor.getSpecialization(),
            doctor.getPhone(),
            totalAppointments,
            completedAppointments,
            availabilityStatus
        );
    }
    
    /**
     * Calculate availability status based on appointments
     */
    public String calculateAvailabilityStatus(int totalSlots, int bookedSlots) {
        if (bookedSlots == 0) return "AVAILABLE";
        if (bookedSlots >= totalSlots) return "UNAVAILABLE";
        return "BUSY";
    }
}
