package com.sms.service;

import com.sms.dto.*;

public interface AuthService {
    AuthResponse login(LoginRequest loginRequest);
    void forgotPassword(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
    void changePassword(String username, ChangePasswordRequest request);
}
