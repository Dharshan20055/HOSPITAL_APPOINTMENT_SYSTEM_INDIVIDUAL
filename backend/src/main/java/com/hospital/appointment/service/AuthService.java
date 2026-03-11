package com.hospital.appointment.service;

import com.hospital.appointment.dto.request.LoginRequest;
import com.hospital.appointment.dto.request.RegisterRequest;
import com.hospital.appointment.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
