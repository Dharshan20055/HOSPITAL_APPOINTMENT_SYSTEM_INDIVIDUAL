package com.hospital.appointment.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DoctorResponse {
    private Long id;
    private String name;
    private String email;
    private String specialization;
    private String phone;
    private int totalAppointments;
    private int completedAppointments;
    private String availabilityStatus; // AVAILABLE, BUSY, UNAVAILABLE
}
