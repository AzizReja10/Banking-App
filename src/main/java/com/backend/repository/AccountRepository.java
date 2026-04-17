package com.backend.repository;

import java.util.*;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.model.Account;
import com.backend.model.User;

public interface AccountRepository extends JpaRepository<Account,Long> {
 Optional<Account> findByAccountNumber(String accountNumber);
 List<Account>findByUser(User user);
}
