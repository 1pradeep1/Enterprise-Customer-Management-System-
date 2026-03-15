package com.enterprise.crm.controller;

import com.enterprise.crm.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final CustomerService customerService;

    @Autowired
    public DashboardController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(customerService.getDashboardStats());
    }
}
