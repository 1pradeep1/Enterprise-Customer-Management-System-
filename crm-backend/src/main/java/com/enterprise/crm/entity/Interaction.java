package com.enterprise.crm.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

@Entity
@Table(name = "interactions")
public class Interaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    @JsonIgnore
    private Customer customer;

    @NotBlank(message = "Interaction type is required")
    @Size(max = 50)
    private String type;

    @NotBlank(message = "Subject is required")
    @Size(max = 200)
    private String subject;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "interaction_date")
    private LocalDateTime interactionDate = LocalDateTime.now();

    public Interaction() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getInteractionDate() { return interactionDate; }
    public void setInteractionDate(LocalDateTime interactionDate) { this.interactionDate = interactionDate; }
}
