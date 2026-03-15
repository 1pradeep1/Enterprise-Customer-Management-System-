package com.enterprise.crm.controller;

import com.enterprise.crm.entity.Customer;
import com.enterprise.crm.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    @Autowired
    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {
        List<Customer> customers;
        if (search != null && !search.isBlank()) {
            customers = customerService.searchCustomers(search);
        } else if (status != null && !status.isBlank()) {
            customers = customerService.getCustomersByStatus(status);
        } else {
            customers = customerService.getAllCustomers();
        }
        return ResponseEntity.ok(customers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getCustomerById(id));
    }

    @PostMapping
    public ResponseEntity<Customer> createCustomer(@Valid @RequestBody Customer customer) {
        return new ResponseEntity<>(customerService.createCustomer(customer), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @Valid @RequestBody Customer customer) {
        return ResponseEntity.ok(customerService.updateCustomer(id, customer));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Customer> changeStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        String changedBy = body.getOrDefault("changedBy", "ADMIN");
        return ResponseEntity.ok(customerService.changeStatus(id, newStatus, changedBy));
    }
}
