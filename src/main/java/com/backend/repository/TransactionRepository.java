package com.backend.repository;

import com.backend.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // All transactions — for history page
    @Query("SELECT t FROM Transaction t WHERE t.fromAccount = :accountNumber " +
           "OR t.toAccount = :accountNumber ORDER BY t.createdAt DESC")
    List<Transaction> findAllByAccountNumber(@Param("accountNumber") String accountNumber);

    // Last 10 only — for dashboard
    @Query("SELECT t FROM Transaction t WHERE t.fromAccount = :accountNumber " +
           "OR t.toAccount = :accountNumber ORDER BY t.createdAt DESC LIMIT 10")
    List<Transaction> findTop10ByAccountNumber(@Param("accountNumber") String accountNumber);
}