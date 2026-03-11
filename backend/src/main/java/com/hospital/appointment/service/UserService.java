package com.hospital.appointment.service;



import java.util.List;

import com.hospital.appointment.dto.UserDTO;
import com.hospital.appointment.entity.User;

public interface UserService {
    List<UserDTO> getAllUsers();
    List<UserDTO> getUsersByRole(String role);
    UserDTO getUserById(Long id);
    UserDTO updateUser(Long id, UserDTO userDTO);
    void deleteUser(Long id);
    User getUserEntityById(Long id);
}
