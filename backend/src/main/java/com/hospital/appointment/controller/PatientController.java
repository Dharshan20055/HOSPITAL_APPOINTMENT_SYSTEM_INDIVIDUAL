package com.hospital.appointment.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hospital.appointment.dto.UserDTO;
import com.hospital.appointment.service.DoctorService;

import java.util.List;

@RestController
@RequestMapping("/api/patient")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
public class PatientController {
    
    private final DoctorService doctorService;
    
    @GetMapping("/doctors")
    @Operation(summary = "Search doctors")
    public ResponseEntity<List<UserDTO>> searchDoctors(
            @RequestParam(required = false) String specialization) {
        if (specialization != null) {
            return ResponseEntity.ok(doctorService.getDoctorsBySpecialization(specialization));
        }
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }
    
    @GetMapping("/doctors/{id}/availability")
    @Operation(summary = "Get doctor availability")
    public ResponseEntity<?> getDoctorAvailability(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getDoctorAvailability(id));
    }
}
