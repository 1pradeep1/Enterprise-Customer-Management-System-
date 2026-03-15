package com.enterprise.crm.controller;

import com.enterprise.crm.entity.Note;
import com.enterprise.crm.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers/{customerId}/notes")
public class NoteController {

    private final CustomerService customerService;

    @Autowired
    public NoteController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public ResponseEntity<List<Note>> getNotes(@PathVariable Long customerId) {
        return ResponseEntity.ok(customerService.getNotes(customerId));
    }

    @PostMapping
    public ResponseEntity<Note> addNote(
            @PathVariable Long customerId,
            @Valid @RequestBody Note note) {
        return new ResponseEntity<>(customerService.addNote(customerId, note), HttpStatus.CREATED);
    }
}
