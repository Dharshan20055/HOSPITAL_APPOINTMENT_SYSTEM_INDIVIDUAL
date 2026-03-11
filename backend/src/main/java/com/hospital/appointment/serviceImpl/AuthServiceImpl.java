package com.hospital.appointment.serviceImpl;


import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hospital.appointment.dto.request.LoginRequest;
import com.hospital.appointment.dto.request.RegisterRequest;
import com.hospital.appointment.dto.response.AuthResponse;
import com.hospital.appointment.entity.User;
import com.hospital.appointment.exception.AppointmentConflictException;
import com.hospital.appointment.repository.UserRepository;
import com.hospital.appointment.security.CustomUserDetails;
import com.hospital.appointment.security.JwtTokenProvider;
import com.hospital.appointment.service.AuthService;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    
    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppointmentConflictException("Email already exists");
        }
        
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setSpecialization(request.getSpecialization());
        user.setPhone(request.getPhone());
        
        User savedUser = userRepository.save(user);
        
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.generateToken(authentication);
        
        return new AuthResponse(
            token,
            savedUser.getEmail(),
            savedUser.getRole().name(),
            savedUser.getId(),
            savedUser.getName()
        );
    }
    
    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.generateToken(authentication);
        
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        
        return new AuthResponse(
            token,
            user.getEmail(),
            user.getRole().name(),
            user.getId(),
            user.getName()
        );
    }
}
