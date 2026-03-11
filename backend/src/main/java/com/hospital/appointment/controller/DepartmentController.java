package com.hospital.appointment.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.hospital.appointment.entity.Department;
import com.hospital.appointment.service.DepartmentService;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
public class DepartmentController {
    
    private final DepartmentService departmentService;
    
    @GetMapping
    @Operation(summary = "Get all departments")
    public ResponseEntity<List<Department>> getAllDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get department by ID")
    public ResponseEntity<Department> getDepartmentById(@PathVariable Long id) {
        Department department = departmentService.getAllDepartments()
            .stream()
            .filter(d -> d.getId().equals(id))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Department not found"));
        return ResponseEntity.ok(department);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create new department (Admin only)")
    public ResponseEntity<Department> createDepartment(
            @Valid @RequestBody Department department) {
        return ResponseEntity.ok(departmentService.createDepartment(department));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update department (Admin only)")
    public ResponseEntity<Department> updateDepartment(
            @PathVariable Long id,
            @Valid @RequestBody Department department) {
        // Fetch existing department and update
        department.setId(id);
        return ResponseEntity.ok(departmentService.createDepartment(department));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete department (Admin only)")
    public ResponseEntity<?> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.ok().body("Department deleted successfully");
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search departments by name")
    public ResponseEntity<List<Department>> searchDepartments(
            @RequestParam String name) {
        List<Department> departments = departmentService.getAllDepartments()
            .stream()
            .filter(d -> d.getName().toLowerCase().contains(name.toLowerCase()))
            .toList();
        return ResponseEntity.ok(departments);
    }
}
