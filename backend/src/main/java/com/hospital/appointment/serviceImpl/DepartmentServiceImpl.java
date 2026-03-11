package com.hospital.appointment.serviceImpl;



import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.hospital.appointment.entity.Department;
import com.hospital.appointment.exception.ResourceNotFoundException;
import com.hospital.appointment.repository.DepartmentRepository;
import com.hospital.appointment.service.DepartmentService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {
    
    private final DepartmentRepository departmentRepository;
    
    @Override
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }
    
    @Override
    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
    }
    
    @Override
    public Department createDepartment(Department department) {
        // Check if department name already exists
        List<Department> existing = departmentRepository.findAll();
        boolean exists = existing.stream()
            .anyMatch(d -> d.getName().equalsIgnoreCase(department.getName()));
        
        if (exists) {
            throw new IllegalArgumentException("Department with this name already exists");
        }
        
        return departmentRepository.save(department);
    }
    
    @Override
    public Department updateDepartment(Long id, Department departmentDetails) {
        Department department = getDepartmentById(id);
        department.setName(departmentDetails.getName());
        department.setDescription(departmentDetails.getDescription());
        return departmentRepository.save(department);
    }
    
    @Override
    public void deleteDepartment(Long id) {
        Department department = getDepartmentById(id);
        departmentRepository.delete(department);
    }
}