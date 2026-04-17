package com.backend.service;

import com.backend.dto.TransferRequest;
import com.backend.model.Account;
import com.backend.model.Transaction;
import com.backend.model.User;
import com.backend.repository.AccountRepository;
import com.backend.repository.TransactionRepository;
import com.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AccountService {

    @Autowired private AccountRepository accountRepository;
    @Autowired private TransactionRepository transactionRepository;
    @Autowired private UserRepository userRepository;

    // Get all accounts for a user
    public List<Account> getUserAccounts(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return accountRepository.findByUser(user);
    }

    // Transfer money between two accounts
    @Transactional   // If anything fails, the whole operation is rolled back
    public void transfer(TransferRequest request) {
        Account from = accountRepository.findByAccountNumber(request.getFromAccount())
                .orElseThrow(() -> new RuntimeException("Source account not found"));
        Account to = accountRepository.findByAccountNumber(request.getToAccount())
                .orElseThrow(() -> new RuntimeException("Destination account not found"));

        if (from.getBalance().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        // Debit source account
        from.setBalance(from.getBalance().subtract(request.getAmount()));
        // Credit destination account
        to.setBalance(to.getBalance().add(request.getAmount()));

        accountRepository.save(from);
        accountRepository.save(to);

        // Record a transaction entry
        Transaction tx = new Transaction();
        tx.setFromAccount(request.getFromAccount());
        tx.setToAccount(request.getToAccount());
        tx.setAmount(request.getAmount());
        tx.setType("TRANSFER");
        tx.setDescription(request.getDescription());
        tx.setAccount(from);
        transactionRepository.save(tx);
    }
public List<Transaction> getRecentTransactions(String accountNumber){
	accountRepository.findByAccountNumber(accountNumber).orElseThrow(()-> new RuntimeException("account not found"));
	return transactionRepository.findTop10ByAccountNumber(accountNumber);
}
public List<Transaction>getTransaction(String accountNumber){
	accountRepository.findByAccountNumber(accountNumber).orElseThrow(()-> new RuntimeException("Account not found"));
	return transactionRepository.findAllByAccountNumber(accountNumber);
}
// Get all transactions for a given account
    public List<Transaction> getTransactions(String accountNumber) {
         accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        return transactionRepository.findAllByAccountNumber(accountNumber);
    }
}