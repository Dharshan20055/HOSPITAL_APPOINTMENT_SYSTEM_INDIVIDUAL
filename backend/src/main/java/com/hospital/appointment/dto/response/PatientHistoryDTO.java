package com.hospital.appointment.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PatientHistoryDTO {
    private Long appointmentId;
    private Long patientId;
    private String patientName;
    private String patientEmail;
    private String patientPhone;
    private LocalDate appointmentDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String status;
    private String departmentName;
    private String notes;
}