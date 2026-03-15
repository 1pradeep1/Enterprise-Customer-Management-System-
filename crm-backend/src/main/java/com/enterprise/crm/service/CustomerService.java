package com.enterprise.crm.service;

import com.enterprise.crm.entity.*;
import com.enterprise.crm.exception.ResourceNotFoundException;
import com.enterprise.crm.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final ContactRepository contactRepository;
    private final AddressRepository addressRepository;
    private final InteractionRepository interactionRepository;
    private final StatusHistoryRepository statusHistoryRepository;
    private final NoteRepository noteRepository;

    @Autowired
    public CustomerService(CustomerRepository customerRepository,
                           ContactRepository contactRepository,
                           AddressRepository addressRepository,
                           InteractionRepository interactionRepository,
                           StatusHistoryRepository statusHistoryRepository,
                           NoteRepository noteRepository) {
        this.customerRepository = customerRepository;
        this.contactRepository = contactRepository;
        this.addressRepository = addressRepository;
        this.interactionRepository = interactionRepository;
        this.statusHistoryRepository = statusHistoryRepository;
        this.noteRepository = noteRepository;
    }

    // ---- Customer CRUD ----

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", id));
    }

    public List<Customer> searchCustomers(String query) {
        if (query == null || query.isBlank()) {
            return customerRepository.findAll();
        }
        return customerRepository.searchCustomers(query);
    }

    public List<Customer> getCustomersByStatus(String status) {
        return customerRepository.findByStatus(status);
    }

    public Customer createCustomer(Customer customer) {
        if (customer.getStatus() == null || customer.getStatus().isBlank()) {
            customer.setStatus("PROSPECT");
        }
        if (customer.getOnboardingStage() == null || customer.getOnboardingStage().isBlank()) {
            customer.setOnboardingStage("NEW");
        }
        Customer saved = customerRepository.save(customer);

        StatusHistory initialStatus = new StatusHistory();
        initialStatus.setCustomer(saved);
        initialStatus.setOldStatus(null);
        initialStatus.setNewStatus(saved.getStatus());
        initialStatus.setChangedBy("SYSTEM");
        initialStatus.setChangedAt(LocalDateTime.now());
        statusHistoryRepository.save(initialStatus);

        return saved;
    }

    public Customer updateCustomer(Long id, Customer updated) {
        Customer existing = getCustomerById(id);
        existing.setCompanyName(updated.getCompanyName());
        existing.setIndustry(updated.getIndustry());
        existing.setOnboardingStage(updated.getOnboardingStage());
        existing.setEmail(updated.getEmail());
        existing.setPhone(updated.getPhone());
        existing.setWebsite(updated.getWebsite());
        return customerRepository.save(existing);
    }

    public void deleteCustomer(Long id) {
        Customer customer = getCustomerById(id);
        customerRepository.delete(customer);
    }

    // ---- Status Management ----

    public Customer changeStatus(Long customerId, String newStatus, String changedBy) {
        Customer customer = getCustomerById(customerId);
        String oldStatus = customer.getStatus();

        customer.setStatus(newStatus);
        customerRepository.save(customer);

        StatusHistory history = new StatusHistory();
        history.setCustomer(customer);
        history.setOldStatus(oldStatus);
        history.setNewStatus(newStatus);
        history.setChangedBy(changedBy != null ? changedBy : "ADMIN");
        history.setChangedAt(LocalDateTime.now());
        statusHistoryRepository.save(history);

        return customer;
    }

    public List<StatusHistory> getStatusHistory(Long customerId) {
        getCustomerById(customerId);
        return statusHistoryRepository.findByCustomerIdOrderByChangedAtDesc(customerId);
    }

    // ---- Contacts ----

    public List<Contact> getContacts(Long customerId) {
        getCustomerById(customerId);
        return contactRepository.findByCustomerId(customerId);
    }

    public Contact addContact(Long customerId, Contact contact) {
        Customer customer = getCustomerById(customerId);
        contact.setCustomer(customer);
        return contactRepository.save(contact);
    }

    public Contact updateContact(Long contactId, Contact updated) {
        Contact existing = contactRepository.findById(contactId)
                .orElseThrow(() -> new ResourceNotFoundException("Contact", contactId));
        existing.setFirstName(updated.getFirstName());
        existing.setLastName(updated.getLastName());
        existing.setEmail(updated.getEmail());
        existing.setPhone(updated.getPhone());
        existing.setRole(updated.getRole());
        existing.setIsPrimary(updated.getIsPrimary());
        return contactRepository.save(existing);
    }

    public void deleteContact(Long contactId) {
        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new ResourceNotFoundException("Contact", contactId));
        contactRepository.delete(contact);
    }

    // ---- Addresses ----

    public List<Address> getAddresses(Long customerId) {
        getCustomerById(customerId);
        return addressRepository.findByCustomerId(customerId);
    }

    public Address addAddress(Long customerId, Address address) {
        Customer customer = getCustomerById(customerId);
        address.setCustomer(customer);
        return addressRepository.save(address);
    }

    // ---- Interactions ----

    public List<Interaction> getInteractions(Long customerId) {
        getCustomerById(customerId);
        return interactionRepository.findByCustomerIdOrderByInteractionDateDesc(customerId);
    }

    public Interaction addInteraction(Long customerId, Interaction interaction) {
        Customer customer = getCustomerById(customerId);
        interaction.setCustomer(customer);
        if (interaction.getInteractionDate() == null) {
            interaction.setInteractionDate(LocalDateTime.now());
        }
        return interactionRepository.save(interaction);
    }

    // ---- Notes ----

    public List<Note> getNotes(Long customerId) {
        getCustomerById(customerId);
        return noteRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    public Note addNote(Long customerId, Note note) {
        Customer customer = getCustomerById(customerId);
        note.setCustomer(customer);
        return noteRepository.save(note);
    }

    // ---- Dashboard Stats ----

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCustomers", customerRepository.count());
        stats.put("activeCustomers", customerRepository.countByStatus("ACTIVE"));
        stats.put("prospectCustomers", customerRepository.countByStatus("PROSPECT"));
        stats.put("onboardingCustomers", customerRepository.countByStatus("ONBOARDING"));
        stats.put("inactiveCustomers", customerRepository.countByStatus("INACTIVE"));
        stats.put("totalContacts", contactRepository.count());
        stats.put("totalInteractions", interactionRepository.count());
        stats.put("recentCustomers", customerRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(5)
                .toList());
        return stats;
    }
}
