package com.hospital.appointment.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hospital.appointment.dto.UserDTO;
import com.hospital.appointment.entity.Department;
import com.hospital.appointment.service.DepartmentService;
import com.hospital.appointment.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
public class AdminController {
    
    private final UserService userService;
    private final DepartmentService departmentService;
    
    @GetMapping("/users")
    @Operation(summary = "Get all users")
    public ResponseEntity<List<UserDTO>> getAllUsers(
            @RequestParam(required = false) String role) {
        if (role != null) {
            return ResponseEntity.ok(userService.getUsersByRole(role));
        }
        return ResponseEntity.ok(userService.getAllUsers());
    }
    
    @DeleteMapping("/users/{id}")
    @Operation(summary = "Delete user")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().body("User deleted successfully");
    }
    
    @GetMapping("/departments")
    @Operation(summary = "Get all departments")
    public ResponseEntity<List<Department>> getAllDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }
    
    @PostMapping("/departments")
    @Operation(summary = "Create department")
    public ResponseEntity<Department> createDepartment(@RequestBody Department department) {
        return ResponseEntity.ok(departmentService.createDepartment(department));
    }
    
    @DeleteMapping("/departments/{id}")
    @Operation(summary = "Delete department")
    public ResponseEntity<?> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.ok().body("Department deleted successfully");
    }
}
