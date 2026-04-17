package com.backend.controller;

import com.backend.dto.TransferRequest;
import com.backend.model.Transaction;
import com.backend.service.AccountService;
import com.backend.model.Account;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    @Autowired private AccountService accountService;

    @GetMapping
    public ResponseEntity<List<Account>> getMyAccounts(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(accountService.getUserAccounts(userDetails.getUsername()));
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(@RequestBody TransferRequest request) {
        try {
            accountService.transfer(request);
            return ResponseEntity.ok(Map.of("message", "Transfer successful"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Last 10 transactions — used by Dashboard
    @GetMapping("/{accountNumber}/transactions/recent")
    public ResponseEntity<?> getRecentTransactions(@PathVariable String accountNumber) {
        try {
            List<Transaction> transactions = accountService.getRecentTransactions(accountNumber);
            return ResponseEntity.ok(mapTransactions(transactions, accountNumber));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // All transactions — used by History page
    @GetMapping("/{accountNumber}/transactions")
    public ResponseEntity<?> getTransactions(@PathVariable String accountNumber) {
        try {
            List<Transaction> transactions = accountService.getTransactions(accountNumber);
            return ResponseEntity.ok(mapTransactions(transactions, accountNumber));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Helper — adds direction field to each transaction
    private List<Map<String, Object>> mapTransactions(List<Transaction> transactions,
                                                       String accountNumber) {
        return transactions.stream().map(tx -> {
            Map<String, Object> map = new java.util.LinkedHashMap<>();
            map.put("id", tx.getId());
            map.put("fromAccount", tx.getFromAccount());
            map.put("toAccount", tx.getToAccount());
            map.put("amount", tx.getAmount());
            map.put("type", tx.getType());
            map.put("description", tx.getDescription());
            map.put("createdAt", tx.getCreatedAt());
            map.put("direction",
                tx.getToAccount().equals(accountNumber) ? "CREDIT" : "DEBIT");
            return map;
        }).toList();
    }
}