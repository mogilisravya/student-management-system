package com.sms.service;

import com.sms.dto.LoginRequest;
import com.sms.dto.AuthResponse;
import com.sms.dto.ForgotPasswordRequest;
import com.sms.entity.Role;
import com.sms.entity.User;
import com.sms.repository.AuditLogRepository;
import com.sms.repository.UserRepository;
import com.sms.security.CustomUserDetails;
import com.sms.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private AuditLogRepository auditLogRepository;

    @InjectMocks
    private AuthServiceImpl authService;

    private User user;
    private Role adminRole;
    private LoginRequest loginRequest;
    private Authentication authentication;

    @BeforeEach
    public void setup() {
        adminRole = Role.builder().id(1).name("ROLE_ADMIN").build();
        user = User.builder()
                .id(1L)
                .username("admin")
                .password("encoded_pass")
                .email("admin@university.edu")
                .role(adminRole)
                .enabled(true)
                .build();
        loginRequest = new LoginRequest("admin", "admin123");
        
        authentication = mock(Authentication.class);
    }

    @Test
    public void testLogin_Success() {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(tokenProvider.generateToken(any())).thenReturn("dummy_jwt_token");
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(user));

        AuthResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertEquals("dummy_jwt_token", response.getToken());
        assertEquals("admin", response.getUsername());
        assertEquals("ROLE_ADMIN", response.getRole());
        verify(auditLogRepository, times(1)).save(any());
    }

    @Test
    public void testForgotPassword_Success() {
        ForgotPasswordRequest request = new ForgotPasswordRequest();
        request.setEmail("admin@university.edu");

        when(userRepository.findByEmail("admin@university.edu")).thenReturn(Optional.of(user));

        authService.forgotPassword(request);

        assertNotNull(user.getResetToken());
        assertNotNull(user.getResetTokenExpiry());
        verify(userRepository, times(1)).save(user);
        verify(auditLogRepository, times(1)).save(any());
    }
}
