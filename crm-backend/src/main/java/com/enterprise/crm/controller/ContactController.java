package com.enterprise.crm.controller;

import com.enterprise.crm.entity.Contact;
import com.enterprise.crm.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ContactController {

    private final CustomerService customerService;

    @Autowired
    public ContactController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping("/customers/{customerId}/contacts")
    public ResponseEntity<List<Contact>> getContacts(@PathVariable Long customerId) {
        return ResponseEntity.ok(customerService.getContacts(customerId));
    }

    @PostMapping("/customers/{customerId}/contacts")
    public ResponseEntity<Contact> addContact(
            @PathVariable Long customerId,
            @Valid @RequestBody Contact contact) {
        return new ResponseEntity<>(customerService.addContact(customerId, contact), HttpStatus.CREATED);
    }

    @PutMapping("/contacts/{id}")
    public ResponseEntity<Contact> updateContact(
            @PathVariable Long id,
            @Valid @RequestBody Contact contact) {
        return ResponseEntity.ok(customerService.updateContact(id, contact));
    }

    @DeleteMapping("/contacts/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
        customerService.deleteContact(id);
        return ResponseEntity.noContent().build();
    }
}
