package com.enterprise.crm.repository;

import com.enterprise.crm.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
    List<Contact> findByCustomerId(Long customerId);
}
