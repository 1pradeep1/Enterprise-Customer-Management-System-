package com.enterprise.crm.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "customers")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Company name is required")
    @Size(max = 200, message = "Company name must be under 200 characters")
    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Size(max = 100)
    private String industry;

    @NotBlank(message = "Status is required")
    @Column(nullable = false)
    private String status;

    @Column(name = "onboarding_stage")
    private String onboardingStage;

    @Size(max = 200)
    private String email;

    @Size(max = 30)
    private String phone;

    @Size(max = 500)
    private String website;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Contact> contacts = new ArrayList<>();

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Address> addresses = new ArrayList<>();

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Interaction> interactions = new ArrayList<>();

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StatusHistory> statusHistory = new ArrayList<>();

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Note> notes = new ArrayList<>();

    public Customer() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getOnboardingStage() { return onboardingStage; }
    public void setOnboardingStage(String onboardingStage) { this.onboardingStage = onboardingStage; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<Contact> getContacts() { return contacts; }
    public void setContacts(List<Contact> contacts) { this.contacts = contacts; }

    public List<Address> getAddresses() { return addresses; }
    public void setAddresses(List<Address> addresses) { this.addresses = addresses; }

    public List<Interaction> getInteractions() { return interactions; }
    public void setInteractions(List<Interaction> interactions) { this.interactions = interactions; }

    public List<StatusHistory> getStatusHistory() { return statusHistory; }
    public void setStatusHistory(List<StatusHistory> statusHistory) { this.statusHistory = statusHistory; }

    public List<Note> getNotes() { return notes; }
    public void setNotes(List<Note> notes) { this.notes = notes; }
}
