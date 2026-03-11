package com.hospital.appointment.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReportResponse {
    private Long doctorId;
    private String doctorName;
    private String specialization;
    private int totalAppointments;
    private int confirmedAppointments;
    private int completedAppointments;
    private int cancelledAppointments;
    private double totalRevenue;
    private List<AppointmentStats> appointmentStats;
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AppointmentStats {
        private String date;
        private int count;
    }
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DepartmentRevenue {
        private Long departmentId;
        private String departmentName;
        private int totalAppointments;
        private int completedAppointments;
        private double totalRevenue;
    }
}
