package com.enterprise.crm.controller;

import com.enterprise.crm.entity.Interaction;
import com.enterprise.crm.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers/{customerId}/interactions")
public class InteractionController {

    private final CustomerService customerService;

    @Autowired
    public InteractionController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public ResponseEntity<List<Interaction>> getInteractions(@PathVariable Long customerId) {
        return ResponseEntity.ok(customerService.getInteractions(customerId));
    }

    @PostMapping
    public ResponseEntity<Interaction> addInteraction(
            @PathVariable Long customerId,
            @Valid @RequestBody Interaction interaction) {
        return new ResponseEntity<>(customerService.addInteraction(customerId, interaction), HttpStatus.CREATED);
    }
}
