package com.hospital.appointment.service;


import java.util.List;

import com.hospital.appointment.dto.request.AppointmentRequest;
import com.hospital.appointment.dto.response.AppointmentResponse;
import com.hospital.appointment.dto.response.PatientHistoryDTO;

public interface AppointmentService {
    AppointmentResponse bookAppointment(Long patientId, AppointmentRequest request);
    List<AppointmentResponse> getPatientAppointments(Long patientId);
    List<AppointmentResponse> getDoctorAppointments(Long doctorId);
    AppointmentResponse confirmAppointment(Long appointmentId, Long doctorId);
    AppointmentResponse completeAppointment(Long appointmentId, Long doctorId, String notes);
    AppointmentResponse cancelAppointment(Long appointmentId, Long userId, String role);
    List<PatientHistoryDTO> getVisitedPatients(Long doctorId);
}
