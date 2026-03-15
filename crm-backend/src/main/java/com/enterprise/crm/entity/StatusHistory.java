package com.enterprise.crm.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

@Entity
@Table(name = "status_history")
public class StatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    @JsonIgnore
    private Customer customer;

    @Column(name = "old_status")
    private String oldStatus;

    @NotBlank(message = "New status is required")
    @Column(name = "new_status", nullable = false)
    private String newStatus;

    @Column(name = "changed_by")
    private String changedBy;

    @Column(name = "changed_at")
    private LocalDateTime changedAt = LocalDateTime.now();

    public StatusHistory() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public String getOldStatus() { return oldStatus; }
    public void setOldStatus(String oldStatus) { this.oldStatus = oldStatus; }

    public String getNewStatus() { return newStatus; }
    public void setNewStatus(String newStatus) { this.newStatus = newStatus; }

    public String getChangedBy() { return changedBy; }
    public void setChangedBy(String changedBy) { this.changedBy = changedBy; }

    public LocalDateTime getChangedAt() { return changedAt; }
    public void setChangedAt(LocalDateTime changedAt) { this.changedAt = changedAt; }
}
