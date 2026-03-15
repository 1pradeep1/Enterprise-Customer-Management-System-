package com.enterprise.crm.repository;

import com.enterprise.crm.entity.StatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StatusHistoryRepository extends JpaRepository<StatusHistory, Long> {
    List<StatusHistory> findByCustomerIdOrderByChangedAtDesc(Long customerId);
}
