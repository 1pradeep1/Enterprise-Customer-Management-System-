package com.enterprise.crm.repository;

import com.enterprise.crm.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    List<Customer> findByStatus(String status);

    List<Customer> findByIndustry(String industry);

    @Query("SELECT c FROM Customer c WHERE LOWER(c.companyName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(c.industry) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Customer> searchCustomers(@Param("search") String search);

    long countByStatus(String status);
}
