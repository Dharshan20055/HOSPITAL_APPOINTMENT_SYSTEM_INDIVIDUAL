package com.hospital.appointment.serviceImpl;



import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hospital.appointment.dto.UserDTO;
import com.hospital.appointment.entity.User;
import com.hospital.appointment.exception.ResourceNotFoundException;
import com.hospital.appointment.repository.UserRepository;
import com.hospital.appointment.service.UserService;
import com.hospital.appointment.util.Mapper;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    
    private final UserRepository userRepository;
    private final Mapper mapper;
    
    @Override
    public List<UserDTO> getAllUsers() {
        return mapper.toUserDTOList(userRepository.findAll());
    }
    
    @Override
    public List<UserDTO> getUsersByRole(String role) {
        return mapper.toUserDTOList(userRepository.findByRole(User.Role.valueOf(role)));
    }
    
    @Override
    public UserDTO getUserById(Long id) {
        User user = getUserEntityById(id);
        return mapper.toUserDTO(user);
    }
    
    @Override
    @Transactional
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User user = getUserEntityById(id);
        user.setName(userDTO.getName());
        user.setPhone(userDTO.getPhone());
        if (userDTO.getSpecialization() != null) {
            user.setSpecialization(userDTO.getSpecialization());
        }
        User updated = userRepository.save(user);
        return mapper.toUserDTO(updated);
    }
    
    @Override
    @Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    
    @Override
    public User getUserEntityById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }
}