package com.backend.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component   // Registers this class as a Spring bean
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;           // Reads from application.properties

    @Value("${jwt.expiration}")
    private long expiration;

    // Creates a signing key from the secret string
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // Generates a JWT token for a given username
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)                          // Payload: who the token is for
                .setIssuedAt(new Date())                       // When it was issued
                .setExpiration(new Date(System.currentTimeMillis() + expiration)) // Expiry
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)  // Sign with HMAC-SHA256
                .compact();                                    // Build and return the token string
    }

    // Extracts the username from a token
    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // Checks if the token is valid and not expired
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;   // Token is invalid or expired
        }
    }
}