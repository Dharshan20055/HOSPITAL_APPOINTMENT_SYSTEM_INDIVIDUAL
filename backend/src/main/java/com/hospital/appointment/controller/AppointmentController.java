package com.hospital.appointment.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.hospital.appointment.dto.request.AppointmentRequest;
import com.hospital.appointment.dto.response.AppointmentResponse;
import com.hospital.appointment.security.CustomUserDetails;
import com.hospital.appointment.service.AppointmentService;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
public class AppointmentController {
    
    private final AppointmentService appointmentService;
    
    @PostMapping("/book")
    @Operation(summary = "Book appointment (Patient)")
    public ResponseEntity<AppointmentResponse> bookAppointment(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody AppointmentRequest request) {
        return ResponseEntity.ok(appointmentService.bookAppointment(userDetails.getId(), request));
    }
    
    @GetMapping("/my-appointments")
    @Operation(summary = "Get patient's appointments")
    public ResponseEntity<List<AppointmentResponse>> getMyAppointments(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(appointmentService.getPatientAppointments(userDetails.getId()));
    }
    
    @PostMapping("/{id}/confirm")
    @Operation(summary = "Confirm appointment (Doctor)")
    public ResponseEntity<AppointmentResponse> confirmAppointment(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(appointmentService.confirmAppointment(id, userDetails.getId()));
    }
    
    @PostMapping("/{id}/complete")
    @Operation(summary = "Complete appointment (Doctor)")
    public ResponseEntity<AppointmentResponse> completeAppointment(
            @PathVariable Long id,
            @RequestParam String notes,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(appointmentService.completeAppointment(id, userDetails.getId(), notes));
    }
    
    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel appointment")
    public ResponseEntity<AppointmentResponse> cancelAppointment(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(appointmentService.cancelAppointment(id, userDetails.getId(), userDetails.getRole()));
    }
}
