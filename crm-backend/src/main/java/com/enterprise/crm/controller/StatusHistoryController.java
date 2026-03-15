package com.enterprise.crm.controller;

import com.enterprise.crm.entity.StatusHistory;
import com.enterprise.crm.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers/{customerId}/status-history")
public class StatusHistoryController {

    private final CustomerService customerService;

    @Autowired
    public StatusHistoryController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public ResponseEntity<List<StatusHistory>> getStatusHistory(@PathVariable Long customerId) {
        return ResponseEntity.ok(customerService.getStatusHistory(customerId));
    }
}
