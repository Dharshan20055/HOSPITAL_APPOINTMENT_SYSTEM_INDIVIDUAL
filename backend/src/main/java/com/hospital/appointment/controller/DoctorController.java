package com.hospital.appointment.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
    
import com.hospital.appointment.dto.request.DoctorAvailabilityRequest;
import com.hospital.appointment.dto.response.AppointmentResponse;
import com.hospital.appointment.dto.response.PatientHistoryDTO;
import com.hospital.appointment.entity.DoctorAvailability;
import com.hospital.appointment.security.CustomUserDetails;
import com.hospital.appointment.service.AppointmentService;
import com.hospital.appointment.service.DoctorService;

import java.util.List;

@RestController
@RequestMapping("/api/doctor")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
public class DoctorController {
    
    private final DoctorService doctorService;
    private final AppointmentService appointmentService;
    
    @GetMapping("/appointments")
    @Operation(summary = "Get doctor's appointments")
    public ResponseEntity<List<AppointmentResponse>> getAppointments(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long doctorId = doctorService.getDoctorIdByEmail(userDetails.getUsername());
        return ResponseEntity.ok(appointmentService.getDoctorAppointments(doctorId));
    }
    
    @GetMapping("/patients/history")
    @Operation(summary = "Get visited patients history")
    public ResponseEntity<List<PatientHistoryDTO>> getVisitedPatients(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long doctorId = doctorService.getDoctorIdByEmail(userDetails.getUsername());
        return ResponseEntity.ok(appointmentService.getVisitedPatients(doctorId));
    }
    
    @GetMapping("/availability")
    @Operation(summary = "Get doctor's availability")
    public ResponseEntity<List<DoctorAvailability>> getAvailability(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long doctorId = doctorService.getDoctorIdByEmail(userDetails.getUsername());
        return ResponseEntity.ok(doctorService.getDoctorAvailability(doctorId));
    }
    
    @PostMapping("/availability")
    @Operation(summary = "Add availability slot")
    public ResponseEntity<DoctorAvailability> addAvailability(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody DoctorAvailabilityRequest request) {
        Long doctorId = doctorService.getDoctorIdByEmail(userDetails.getUsername());
        return ResponseEntity.ok(doctorService.addAvailability(doctorId, request));
    }
}
