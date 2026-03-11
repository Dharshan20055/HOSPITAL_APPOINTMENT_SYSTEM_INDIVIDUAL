package com.hospital.appointment.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.hospital.appointment.dto.UserDTO;
import com.hospital.appointment.security.CustomUserDetails;
import com.hospital.appointment.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
public class UserController {
    
    private final UserService userService;
    
    @GetMapping("/profile")
    @Operation(summary = "Get current user profile")
    public ResponseEntity<UserDTO> getProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(userService.getUserById(userDetails.getId()));
    }
    
    @PutMapping("/profile")
    @Operation(summary = "Update current user profile")
    public ResponseEntity<UserDTO> updateProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody UserDTO userDTO) {
        // Implementation for profile update
        return ResponseEntity.ok(userService.getUserById(userDetails.getId()));
    }
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all users (Admin only)")
    public ResponseEntity<List<UserDTO>> getAllUsers(
            @RequestParam(required = false) String role) {
        if (role != null) {
            return ResponseEntity.ok(userService.getUsersByRole(role));
        }
        return ResponseEntity.ok(userService.getAllUsers());
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get user by ID (Admin only)")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete user (Admin only)")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().body("User deleted successfully");
    }
    
    @GetMapping("/doctors")
    @Operation(summary = "Get all doctors")
    public ResponseEntity<List<UserDTO>> getAllDoctors() {
        return ResponseEntity.ok(userService.getUsersByRole("DOCTOR"));
    }
    
    @GetMapping("/patients")
    @Operation(summary = "Get all patients")
    public ResponseEntity<List<UserDTO>> getAllPatients() {
        return ResponseEntity.ok(userService.getUsersByRole("PATIENT"));
    }
}
