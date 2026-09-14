import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { Modal } from "./common/Modal";
import { Button } from "./common/Button";
import { Input } from "./common/Input";
import { CheckCircleIcon, ShieldCheckIcon, EyeIcon, EyeOffIcon, UserIcon, GoogleIcon } from "./Icons";

// Import dedicated component stylesheet
import "./AuthModal.css";

/**
 * AuthModal Component
 * Simple e-commerce authentication modal for both Users (Customers) and Client Admins.
 *
 * Includes for both Customer and Admin:
 * 1. Login with Password (supports Email or Mobile Phone)
 * 2. Registration (Name, Email, Mobile, Password, Confirm Password, Admin Key for Staff)
 * 3. "Verify Me" method for Email OR Mobile (OTP verification code step)
 * 4. Forgot Password flow with Verification via Email OR Mobile (OTP code step)
 * 5. One-touch Google Authentication
 */
export const AuthModal = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    login,
    loginWithGoogle,
    register,
    registerAdmin,
    sendVerificationCode,
    verifyCode,
    resetPassword,
    setActiveView,
    showToast,
  } = useStore();

  // Role: 'customer' | 'admin'
  const [role, setRole] = useState("customer");

  // Customer sub-mode: 'login' | 'register' | 'forgot' | 'verify_me'
  const [customerMode, setCustomerMode] = useState("login");

  // Admin sub-mode: 'login' | 'register' | 'forgot' | 'verify_me'
  const [adminMode, setAdminMode] = useState("login");

  // Customer Login fields
  const [customerIdentifier, setCustomerIdentifier] = useState("");
  const [customerPassword, setCustomerPassword] = useState("");
  const [showCustomerPass, setShowCustomerPass] = useState(false);
  const [rememberCustomer, setRememberCustomer] = useState(true);

  // Customer Register fields
  const [custName, setCustName] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custPassword, setCustPassword] = useState("");
  const [custConfirmPass, setCustConfirmPass] = useState("");

  // Registration verification flow states
  const [regStep, setRegStep] = useState(1); // 1: Fill form, 2: Choose channel, 3: Enter OTP, 4: Verified Success Screen
  const [regVerifyChannel, setRegVerifyChannel] = useState("email"); // 'email' | 'mobile'
  const [regOtpCode, setRegOtpCode] = useState("");
  const [regEmailVerified, setRegEmailVerified] = useState(false);
  const [regPhoneVerified, setRegPhoneVerified] = useState(false);
  const [regVerifyingTarget, setRegVerifyingTarget] = useState(""); // which target is being verified
  const [registeredSuccessMsg, setRegisteredSuccessMsg] = useState("");

  // Admin Login fields
  const [adminIdentifier, setAdminIdentifier] = useState("admin@urbancart.com");
  const [adminPassword, setAdminPassword] = useState("adminpassword");
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [rememberAdmin, setRememberAdmin] = useState(true);

  // Admin / Client Register fields
  const [adminRegName, setAdminRegName] = useState("");
  const [adminRegEmail, setAdminRegEmail] = useState("");
  const [adminRegPhone, setAdminRegPhone] = useState("");
  const [adminKey, setAdminKey] = useState("URBANCART-ADMIN");
  const [adminRegPassword, setAdminRegPassword] = useState("");
  const [adminRegConfirmPass, setAdminRegConfirmPass] = useState("");
  const [showAdminRegPass, setShowAdminRegPass] = useState(false);

  // Shared Verification / OTP states for Email ya Mobile
  const [verifyChannel, setVerifyChannel] = useState("email"); // 'email' | 'mobile'
  const [verifyTarget, setVerifyTarget] = useState("");
  const [otpStep, setOtpStep] = useState(1); // 1: Send, 2: Enter OTP, 3: Set Password (or Success)
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Sync mode when modal opens
  React.useEffect(() => {
    if (authModalMode === "admin") {
      setRole("admin");
      setAdminMode("login");
    } else if (authModalMode === "register") {
      setRole("customer");
      setCustomerMode("register");
    } else {
      setCustomerMode("login");
    }
    setError("");
    setOtpStep(1);
    setOtpCode("");
    setRegisteredSuccessMsg("");
  }, [authModalMode, isAuthModalOpen]);

  const goToLoginAfterRegistration = React.useCallback(() => {
    setCustomerIdentifier(custEmail.trim() || custPhone.trim());
    setRegisteredSuccessMsg("Account verified successfully! Please enter your password to sign in.");
    setCustomerMode("login");
    setCustomerPassword("");
    setRegStep(1);
    setRegOtpCode("");
    setRegEmailVerified(false);
    setRegPhoneVerified(false);
    setError("");
  }, [custEmail, custPhone]);

  const handleCompleteAndGoToLogin = React.useCallback(async () => {
    setIsLoading(true);
    try {
      if (custEmail && custPassword) {
        await register(
          {
            name: custName,
            email: custEmail,
            phone: custPhone,
            password: custPassword,
          },
          { autoLogin: false }
        );
      }
    } catch (regErr) {
      console.warn("Account registration note:", regErr.message);
    } finally {
      setIsLoading(false);
      goToLoginAfterRegistration();
      showToast("Verification successful! Please sign in with your password.", "success");
    }
  }, [custName, custEmail, custPhone, custPassword, register, goToLoginAfterRegistration, showToast]);

  // Auto-redirect when verification succeeded or on Step 4
  React.useEffect(() => {
    let timer;
    if (customerMode === "register") {
      if (regStep === 4 || (regStep === 2 && (regEmailVerified || regPhoneVerified))) {
        timer = setTimeout(() => {
          handleCompleteAndGoToLogin();
        }, 600);
      }
    }
    return () => clearTimeout(timer);
  }, [customerMode, regStep, regEmailVerified, regPhoneVerified, handleCompleteAndGoToLogin]);

  if (!isAuthModalOpen) return null;

  // -------------------------------------------------------------
  // CUSTOMER ACTIONS
  // -------------------------------------------------------------
  const handleCustomerLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!customerIdentifier.trim()) {
      setError("Please enter your email or mobile phone number.");
      return;
    }
    if (!customerPassword) {
      setError("Please enter your password.");
      return;
    }

    setIsLoading(true);
    try {
      await login(customerIdentifier, customerPassword);
      closeAuthModal();
      showToast("Welcome back! Successfully signed in.", "success");
    } catch (err) {
      setError(err.message || "Login failed. Please verify credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setIsLoading(true);
    try {
      const user = await loginWithGoogle();
      if (user) {
        closeAuthModal();
      }
    } catch (err) {
      setError(err.message || "Google sign-in failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Validate form fields and move to verification step
  const handleRegFormSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!custName.trim() || !custEmail.trim()) {
      setError("Please enter your full name and email address.");
      return;
    }
    if (!custPassword || custPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (custPassword !== custConfirmPass) {
      setError("Passwords do not match.");
      return;
    }

    // Move to verification step
    setRegStep(2);
    setRegEmailVerified(false);
    setRegPhoneVerified(false);
    setRegVerifyChannel("email");
    setRegOtpCode("");
    setError("");
  };

  // Step 2: Send OTP for registration verification
  const handleRegSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    const target = regVerifyChannel === "email" ? custEmail.trim() : custPhone.trim();
    if (!target) {
      setError(
        `Please enter your ${regVerifyChannel === "email" ? "email address" : "mobile phone number"} in the registration form.`,
      );
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendVerificationCode({
        type: regVerifyChannel,
        target,
      });
      setRegVerifyingTarget(target);
      setRegStep(3);
      showToast(res.message || `Code sent to ${target}`, "info");
    } catch (err) {
      setError(err.message || "Failed to send verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Verify OTP, create account, and go DIRECTLY to login page
  const handleRegVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!regOtpCode.trim()) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setIsLoading(true);
    try {
      await verifyCode({ target: regVerifyingTarget, code: regOtpCode });

      // Mark verified
      if (regVerifyChannel === "email") {
        setRegEmailVerified(true);
      } else {
        setRegPhoneVerified(true);
      }

      // Complete registration in backend
      try {
        await register(
          {
            name: custName,
            email: custEmail,
            phone: custPhone,
            password: custPassword,
          },
          { autoLogin: false }
        );
      } catch (regErr) {
        console.warn("Account creation note:", regErr.message);
      }

      // Directly go to sign in / login page
      goToLoginAfterRegistration();
      showToast("Verification successful! Please sign in with your password.", "success");
    } catch (err) {
      setError(err.message || "Verification failed. Please check the code.");
    } finally {
      setIsLoading(false);
    }
  };


  // -------------------------------------------------------------
  // ADMIN ACTIONS
  // -------------------------------------------------------------
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!adminIdentifier.trim() || !adminPassword) {
      setError("Please enter admin email/phone and password.");
      return;
    }

    setIsLoading(true);
    try {
      const user = await login(adminIdentifier, adminPassword);
      closeAuthModal();
      if (user.role === "admin") {
        setActiveView("admin_dashboard");
        showToast("Admin verified. Welcome to Operations Console.", "success");
      } else {
        showToast("Signed in successfully.", "success");
      }
    } catch (err) {
      setError(err.message || "Administrator authentication failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!adminRegName.trim() || !adminRegEmail.trim()) {
      setError("Please enter your full name and admin email address.");
      return;
    }
    if (!adminRegPassword || adminRegPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (adminRegPassword !== adminRegConfirmPass) {
      setError("Passwords do not match.");
      return;
    }
    if (adminKey.trim() !== "URBANCART-ADMIN") {
      setError("Invalid Staff Authorization Key. Use URBANCART-ADMIN.");
      return;
    }

    setIsLoading(true);
    try {
      await registerAdmin({
        name: adminRegName.trim(),
        email: adminRegEmail.trim(),
        phone: adminRegPhone.trim() || "+1 (555) 999-0192",
        password: adminRegPassword,
        adminKey: adminKey.trim(),
      });
      closeAuthModal();
      showToast(`Admin account created. Welcome, ${adminRegName}!`, "success");
      setActiveView("admin_dashboard");
    } catch (err) {
      setError(err.message || "Admin registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------
  // VERIFICATION & FORGOT PASSWORD ACTIONS (EMAIL YA MOBILE)
  // -------------------------------------------------------------
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!verifyTarget.trim()) {
      setError(
        `Please enter your ${verifyChannel === "email" ? "email address" : "mobile phone number"}.`,
      );
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendVerificationCode({
        type: verifyChannel,
        target: verifyTarget,
      });
      setOtpStep(2);
      showToast(res.message || `Code sent to ${verifyTarget}`, "info");
    } catch (err) {
      setError(err.message || "Failed to dispatch verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!otpCode.trim()) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setIsLoading(true);
    try {
      await verifyCode({ target: verifyTarget, code: otpCode });
      setOtpStep(3);
      showToast("Verification code confirmed!", "success");
    } catch (err) {
      setError(err.message || "Invalid verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!newPassword || newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword({ target: verifyTarget, newPassword });
      setOtpStep(4);
      showToast("Password updated successfully!", "success");
    } catch (err) {
      setError(err.message || "Failed to update password.");
    } finally {
      setIsLoading(false);
    }
  };

  // Switch between tabs / modes and reset errors
  const switchCustomerMode = (m) => {
    setCustomerMode(m);
    setError("");
    setOtpStep(1);
    setOtpCode("");
    setRegisteredSuccessMsg("");
    // Reset registration verification flow
    if (m === "register") {
      setRegStep(1);
      setRegOtpCode("");
      setRegEmailVerified(false);
      setRegPhoneVerified(false);
    }
  };

  const switchAdminMode = (m) => {
    setAdminMode(m);
    setError("");
    setOtpStep(1);
    setOtpCode("");
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      maxWidth="480px"
      title={role === "admin" ? "Admin Portal" : "Market Hub Account"}
      subtitle={
        role === "admin"
          ? "Enterprise backoffice & inventory management"
          : "Sign in or register for one-click orders, tracking & perks"
      }
      badge="UrbanCart Market Hub"
      icon={role === "admin" ? <ShieldCheckIcon size={18} /> : <UserIcon size={18} />}
    >
      {/* Error Alert Box */}
      {error && (
        <div
          style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#991b1b",
            borderRadius: "10px",
            padding: "10px 14px",
            fontSize: "0.78125rem",
            marginBottom: "16px",
          }}
        >
          {error}
        </div>
      )}

      {/* ===================================================================== */}
      {/* SECTION A: CUSTOMER PORTAL                                            */}
      {/* ===================================================================== */}
      {role === "customer" && (
        <>
          {/* Sub-navigation Tabs for Customer */}
          {customerMode !== "forgot" && customerMode !== "verify_me" && !(customerMode === "register" && regStep > 1) && (
            <div
              style={{
                display: "flex",
                backgroundColor: "#f8fafc",
                borderRadius: "14px",
                padding: "4px",
                marginBottom: "20px",
                border: "1px solid #e2e8f0",
              }}
            >
              {[
                { id: "login", label: "Sign In", icon: "🔑" },
                { id: "register", label: "Register", icon: "✨" },
              ].map((tab) => {
                const isActive = customerMode === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => switchCustomerMode(tab.id)}
                    style={{
                      flex: 1,
                      padding: "10px 16px",
                      fontSize: "0.875rem",
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? "#0f172a" : "#64748b",
                      backgroundColor: isActive ? "#ffffff" : "transparent",
                      borderRadius: "10px",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      boxShadow: isActive ? "0 2px 8px rgba(15, 23, 42, 0.08)" : "none",
                      transition: "all 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Customer Login */}
          {customerMode === "login" && (
            <form
              onSubmit={handleCustomerLogin}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {registeredSuccessMsg && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px 14px",
                    backgroundColor: "#f0fdf4",
                    border: "1.5px solid #86efac",
                    borderRadius: "10px",
                    color: "#15803d",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    lineHeight: 1.4,
                  }}
                >
                  <CheckCircleIcon size={18} />
                  <span>{registeredSuccessMsg}</span>
                </div>
              )}

              <Input
                label="Email or Mobile Phone Number"
                placeholder="Enter email or mobile phone (e.g. +91 98340 58896)"
                value={customerIdentifier}
                onChange={(e) => setCustomerIdentifier(e.target.value)}
                required
              />

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <label
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#374151",
                    }}
                  >
                    Password <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => switchCustomerMode("forgot")}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "0.75rem",
                      color: "#4b5563",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "color 0.15s ease",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#0f1115")}
                    onMouseLeave={(e) => (e.target.style.color = "#4b5563")}
                  >
                    Forgot password?
                  </button>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    type={showCustomerPass ? "text" : "password"}
                    placeholder="Enter your password"
                    value={customerPassword}
                    onChange={(e) => setCustomerPassword(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "11px 44px 11px 14px",
                      fontSize: "0.875rem",
                      border: "1.5px solid #e5e7eb",
                      borderRadius: "10px",
                      outline: "none",
                      backgroundColor: "#fafaf9",
                      transition: "all 0.15s ease",
                      color: "#111827",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#0f1115";
                      e.target.style.backgroundColor = "#ffffff";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(15, 17, 21, 0.08)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e5e7eb";
                      e.target.style.backgroundColor = "#fafaf9";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCustomerPass(!showCustomerPass)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      padding: "6px",
                      color: "#6b7280",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "6px",
                      transition: "color 0.15s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#111827")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#6b7280")
                    }
                    title={showCustomerPass ? "Hide password" : "Show password"}
                  >
                    {showCustomerPass ? (
                      <EyeOffIcon size={18} />
                    ) : (
                      <EyeIcon size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "0.8125rem",
                  color: "#4b5563",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={rememberCustomer}
                    onChange={(e) => setRememberCustomer(e.target.checked)}
                    style={{
                      width: "16px",
                      height: "16px",
                      accentColor: "#0f1115",
                      cursor: "pointer",
                    }}
                  />
                  <span>Remember me on this device</span>
                </label>
                <button
                  type="button"
                  onClick={() => switchCustomerMode("verify_me")}
                  style={{
                    backgroundColor: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: "6px",
                    padding: "4px 10px",
                    color: "#15803d",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#dcfce7";
                    e.currentTarget.style.borderColor = "#86efac";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#f0fdf4";
                    e.currentTarget.style.borderColor = "#bbf7d0";
                  }}
                >
                  <span>⚡</span>
                  <span>Verify with OTP</span>
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                style={{
                  padding: "13px 20px",
                  borderRadius: "11px",
                  fontSize: "0.9375rem",
                  fontWeight: 700,
                  boxShadow: "0 4px 14px rgba(15, 17, 21, 0.22)",
                }}
              >
                Sign In to Account →
              </Button>

              {/* Minimalist Divider */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "6px 0",
                  color: "#9ca3af",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                }}
              >
                <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }} />
                <span
                  style={{
                    padding: "0 12px",
                    color: "#6b7280",
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  or continue with
                </span>
                <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }} />
              </div>

              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  padding: "12px 18px",
                  borderRadius: "12px",
                  border: "1.5px solid #dadce0",
                  backgroundColor: "#ffffff",
                  color: "#1f2937",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: isLoading ? "not-allowed" : "pointer",
                  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8fafd";
                  e.currentTarget.style.borderColor = "#1a73e8";
                  e.currentTarget.style.boxShadow = "0 4px 14px rgba(26, 115, 232, 0.14)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ffffff";
                  e.currentTarget.style.borderColor = "#dadce0";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.04)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <GoogleIcon size={19} />
                <span>Continue with Google</span>
              </button>
            </form>
          )}

          {/* Customer Register */}
          {customerMode === "register" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>

              {/* Registration Step Indicator */}
              {regStep > 1 && regStep < 4 && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setRegStep(regStep === 3 ? 2 : 1);
                      setRegOtpCode("");
                      setError("");
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#6b7280",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    ← Back
                  </button>
                  <div style={{ flex: 1 }} />
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    {[1, 2, 3].map((s) => (
                      <div
                        key={s}
                        style={{
                          width: s === regStep ? "24px" : "8px",
                          height: "8px",
                          borderRadius: "4px",
                          backgroundColor:
                            s < regStep ? "#059669" : s === regStep ? "#0f1115" : "#d1d5db",
                          transition: "all 0.3s ease",
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Verified badges summary */}
              {regStep >= 2 && regStep < 4 && (regEmailVerified || regPhoneVerified) && (
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {regEmailVerified && (
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        backgroundColor: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                        borderRadius: "6px",
                        padding: "4px 10px",
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        color: "#15803d",
                      }}
                    >
                      <CheckCircleIcon size={13} /> Email Verified
                    </div>
                  )}
                  {regPhoneVerified && (
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        backgroundColor: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                        borderRadius: "6px",
                        padding: "4px 10px",
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        color: "#15803d",
                      }}
                    >
                      <CheckCircleIcon size={13} /> Mobile Verified
                    </div>
                  )}
                </div>
              )}

              {/* ── STEP 1: Registration Form ── */}
              {regStep === 1 && (
                <form
                  onSubmit={handleRegFormSubmit}
                  style={{ display: "flex", flexDirection: "column", gap: "15px" }}
                >
                  <Input
                    label="Full Name"
                    placeholder="e.g. Sarang Satpute"
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    required
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="e.g. sarang@gmail.com"
                    value={custEmail}
                    onChange={(e) => setCustEmail(e.target.value)}
                    required
                  />

                  <Input
                    label="Mobile Phone Number"
                    type="tel"
                    placeholder="e.g. +91 98340 58896"
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                  />

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#374151",
                      }}
                    >
                      Password <span style={{ color: "#dc2626" }}>*</span>
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showCustomerPass ? "text" : "password"}
                        placeholder="At least 6 characters"
                        value={custPassword}
                        onChange={(e) => setCustPassword(e.target.value)}
                        required
                        style={{
                          width: "100%",
                          padding: "11px 44px 11px 14px",
                          fontSize: "0.875rem",
                          border: "1.5px solid #e5e7eb",
                          borderRadius: "10px",
                          outline: "none",
                          backgroundColor: "#fafaf9",
                          transition: "all 0.15s ease",
                          color: "#111827",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#0f1115";
                          e.target.style.backgroundColor = "#ffffff";
                          e.target.style.boxShadow =
                            "0 0 0 3px rgba(15, 17, 21, 0.08)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#e5e7eb";
                          e.target.style.backgroundColor = "#fafaf9";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCustomerPass(!showCustomerPass)}
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          padding: "6px",
                          color: "#6b7280",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "6px",
                          transition: "color 0.15s ease",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "#111827")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "#6b7280")
                        }
                        title={showCustomerPass ? "Hide password" : "Show password"}
                      >
                        {showCustomerPass ? (
                          <EyeOffIcon size={18} />
                        ) : (
                          <EyeIcon size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="Re-enter password"
                    value={custConfirmPass}
                    onChange={(e) => setCustConfirmPass(e.target.value)}
                    required
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={isLoading}
                    style={{
                      marginTop: "4px",
                      padding: "13px 20px",
                      borderRadius: "11px",
                      fontSize: "0.9375rem",
                      fontWeight: 700,
                      boxShadow: "0 4px 14px rgba(15, 17, 21, 0.22)",
                    }}
                  >
                    Continue to Verify →
                  </Button>

                  {/* Minimalist Divider */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      margin: "6px 0",
                      color: "#9ca3af",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                    }}
                  >
                    <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }} />
                    <span
                      style={{
                        padding: "0 12px",
                        color: "#6b7280",
                        fontSize: "0.6875rem",
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}
                    >
                      or register with
                    </span>
                    <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }} />
                  </div>

                  {/* Google Sign Up Button */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      padding: "12px 18px",
                      borderRadius: "12px",
                      border: "1.5px solid #dadce0",
                      backgroundColor: "#ffffff",
                      color: "#1f2937",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      cursor: isLoading ? "not-allowed" : "pointer",
                      transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
                      position: "relative",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8fafd";
                      e.currentTarget.style.borderColor = "#1a73e8";
                      e.currentTarget.style.boxShadow = "0 4px 14px rgba(26, 115, 232, 0.14)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffffff";
                      e.currentTarget.style.borderColor = "#dadce0";
                      e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.04)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <GoogleIcon size={19} />
                    <span>Sign Up with Google</span>
                  </button>
                </form>
              )}

              {/* ── STEP 2: Choose Verification Channel & Send OTP ── */}
              {regStep === 2 && (
                regEmailVerified || regPhoneVerified ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                      textAlign: "center",
                      padding: "16px 8px",
                      backgroundColor: "#f0fdf4",
                      border: "1.5px solid #86efac",
                      borderRadius: "14px",
                    }}
                  >
                    <div
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "50%",
                        backgroundColor: "#dcfce7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto",
                        color: "#16a34a",
                      }}
                    >
                      <CheckCircleIcon size={32} />
                    </div>
                    <div>
                      <h3
                        style={{
                          fontSize: "1.125rem",
                          fontWeight: 800,
                          color: "#14532d",
                          margin: "0 0 6px 0",
                        }}
                      >
                        {regEmailVerified ? "Email" : "Mobile"} Verified Successfully!
                      </h3>
                      <p
                        style={{
                          fontSize: "0.84rem",
                          color: "#166534",
                          margin: 0,
                          lineHeight: 1.4,
                        }}
                      >
                        Your verification was successful. Redirecting directly to the login page...
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="primary"
                      size="lg"
                      fullWidth
                      loading={isLoading}
                      onClick={handleCompleteAndGoToLogin}
                      style={{
                        padding: "12px 18px",
                        borderRadius: "10px",
                        fontSize: "0.9375rem",
                        fontWeight: 700,
                      }}
                    >
                      Go to Sign In Page →
                    </Button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleRegSendOtp}
                    style={{ display: "flex", flexDirection: "column", gap: "14px" }}
                  >
                    {/* Account summary */}
                    <div
                      style={{
                        backgroundColor: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: "10px",
                        padding: "12px 14px",
                        fontSize: "0.8125rem",
                        color: "#475569",
                      }}
                    >
                      <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: "4px" }}>
                        🛡️ Verify Your Identity
                      </div>
                      Verify your <strong>Email</strong>
                      {custPhone.trim() ? " or " : ""}
                      {custPhone.trim() ? <strong>Mobile Number</strong> : ""}
                      {" "}to complete registration.
                    </div>

                    {/* Channel selector */}
                    <label
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#374151",
                      }}
                    >
                      Choose verification method:
                    </label>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "10px",
                      }}
                    >
                      {/* Email toggle */}
                      <button
                        type="button"
                        disabled={regEmailVerified}
                        onClick={() => setRegVerifyChannel("email")}
                        style={{
                          padding: "10px",
                          borderRadius: "8px",
                          border: regEmailVerified
                            ? "2px solid #059669"
                            : regVerifyChannel === "email"
                              ? "2px solid #0f1115"
                              : "1px solid #d1d5db",
                          backgroundColor: regEmailVerified
                            ? "#f0fdf4"
                            : regVerifyChannel === "email"
                              ? "#fafaf9"
                              : "#ffffff",
                          fontWeight:
                            regEmailVerified || regVerifyChannel === "email" ? 700 : 500,
                          fontSize: "0.8125rem",
                          cursor: regEmailVerified ? "default" : "pointer",
                          color: regEmailVerified ? "#059669" : "inherit",
                          opacity: regEmailVerified ? 0.8 : 1,
                        }}
                      >
                        {regEmailVerified ? "✅" : "✉️"} Email
                      </button>

                      {/* Mobile toggle */}
                      <button
                        type="button"
                        disabled={regPhoneVerified}
                        onClick={() => setRegVerifyChannel("mobile")}
                        style={{
                          padding: "10px",
                          borderRadius: "8px",
                          border: regPhoneVerified
                            ? "2px solid #059669"
                            : regVerifyChannel === "mobile"
                              ? "2px solid #0f1115"
                              : "1px solid #d1d5db",
                          backgroundColor: regPhoneVerified
                            ? "#f0fdf4"
                            : regVerifyChannel === "mobile"
                              ? "#fafaf9"
                              : "#ffffff",
                          fontWeight:
                            regPhoneVerified || regVerifyChannel === "mobile" ? 700 : 500,
                          fontSize: "0.8125rem",
                          cursor: regPhoneVerified ? "default" : "pointer",
                          color: regPhoneVerified ? "#059669" : "inherit",
                          opacity: regPhoneVerified ? 0.8 : 1,
                        }}
                      >
                        {regPhoneVerified ? "✅" : "📱"} Mobile
                      </button>
                    </div>

                    {/* Manual input field for email or mobile */}
                    <Input
                      label={
                        regVerifyChannel === "email"
                          ? "Email Address *"
                          : "Mobile Phone Number *"
                      }
                      type={regVerifyChannel === "email" ? "email" : "tel"}
                      placeholder={
                        regVerifyChannel === "email"
                          ? "Enter your email address"
                          : "Enter your mobile number (e.g. +91 98340 58896)"
                      }
                      value={regVerifyChannel === "email" ? custEmail : custPhone}
                      onChange={(e) =>
                        regVerifyChannel === "email"
                          ? setCustEmail(e.target.value)
                          : setCustPhone(e.target.value)
                      }
                      required
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      loading={isLoading}
                    >
                      Send Verification Code →
                    </Button>
                  </form>
                )
              )}

              {/* ── STEP 3: Enter OTP Code ── */}
              {regStep === 3 && (
                <form
                  onSubmit={handleRegVerifyOtp}
                  style={{ display: "flex", flexDirection: "column", gap: "14px" }}
                >
                  <div
                    style={{
                      backgroundColor: "#f3f4f6",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      fontSize: "0.75rem",
                    }}
                  >
                    Code sent to{" "}
                    <strong>{regVerifyingTarget}</strong>
                    {" "}via {regVerifyChannel === "email" ? "Email" : "SMS"}.

                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#374151",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      Enter 6-Digit OTP Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="000000"
                      value={regOtpCode}
                      onChange={(e) => setRegOtpCode(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        fontSize: "1.25rem",
                        letterSpacing: "0.25em",
                        textAlign: "center",
                        fontWeight: 700,
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                        outline: "none",
                        transition: "border-color 0.15s ease",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#0f1115";
                        e.target.style.boxShadow = "0 0 0 3px rgba(15, 17, 21, 0.08)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#d1d5db";
                        e.target.style.boxShadow = "none";
                      }}
                      required
                      autoFocus
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={isLoading}
                    style={{
                      padding: "13px 20px",
                      borderRadius: "11px",
                      fontSize: "0.9375rem",
                      fontWeight: 700,
                      boxShadow: "0 4px 14px rgba(15, 17, 21, 0.22)",
                    }}
                  >
                    Verify & Go to Sign In →
                  </Button>

                  <button
                    type="button"
                    onClick={() => {
                      setRegStep(2);
                      setRegOtpCode("");
                      setError("");
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "0.75rem",
                      color: "#6b7280",
                      fontWeight: 600,
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                  >
                    Didn't receive? Resend code
                  </button>
                </form>
              )}

              {/* ── STEP 4: Registration & Verification Success Screen ── */}
              {regStep === 4 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "16px 6px 10px 6px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "18px",
                  }}
                >
                  {/* Glowing success icon container */}
                  <div
                    style={{
                      width: "68px",
                      height: "68px",
                      borderRadius: "50%",
                      backgroundColor: "#ecfdf5",
                      border: "2px solid #86efac",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#15803d",
                      boxShadow: "0 8px 24px -4px rgba(22, 163, 74, 0.22)",
                    }}
                  >
                    <CheckCircleIcon size={38} />
                  </div>

                  <div>
                    <div
                      style={{
                        display: "inline-block",
                        fontSize: "0.6875rem",
                        fontWeight: 800,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#16a34a",
                        backgroundColor: "#f0fdf4",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        marginBottom: "10px",
                        border: "1px solid #bbf7d0",
                      }}
                    >
                      ✓ Verification Confirmed
                    </div>
                    <h3
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: 800,
                        color: "#0f172a",
                        margin: "0 0 6px 0",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      Registration Successful!
                    </h3>
                    <p
                      style={{
                        fontSize: "0.84375rem",
                        color: "#475569",
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      Welcome, <strong>{custName}</strong>. Your account has been verified and registered. Please proceed to sign in with your password.
                    </p>
                  </div>

                  {/* Summary Card of Registered Account */}
                  <div
                    style={{
                      width: "100%",
                      backgroundColor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      padding: "14px 16px",
                      textAlign: "left",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "0.8125rem",
                      }}
                    >
                      <span style={{ color: "#64748b", fontWeight: 500 }}>Email Address</span>
                      <span
                        style={{
                          fontWeight: 600,
                          color: "#0f172a",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        {custEmail}
                        <span
                          style={{
                            backgroundColor: "#dcfce7",
                            color: "#15803d",
                            fontSize: "0.6875rem",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontWeight: 700,
                          }}
                        >
                          ✓ Verified
                        </span>
                      </span>
                    </div>

                    {custPhone.trim() && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: "0.8125rem",
                          borderTop: "1px solid #f1f5f9",
                          paddingTop: "8px",
                        }}
                      >
                        <span style={{ color: "#64748b", fontWeight: 500 }}>Mobile Phone</span>
                        <span
                          style={{
                            fontWeight: 600,
                            color: "#0f172a",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          {custPhone}
                          <span
                            style={{
                              backgroundColor: "#dcfce7",
                              color: "#15803d",
                              fontSize: "0.6875rem",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontWeight: 700,
                            }}
                          >
                            ✓ Verified
                          </span>
                        </span>
                      </div>
                    )}

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "0.8125rem",
                        borderTop: "1px solid #f1f5f9",
                        paddingTop: "8px",
                      }}
                    >
                      <span style={{ color: "#64748b", fontWeight: 500 }}>Status</span>
                      <span
                        style={{
                          color: "#15803d",
                          fontWeight: 700,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <ShieldCheckIcon size={14} /> Ready to Sign In
                      </span>
                    </div>
                  </div>

                  {/* Primary Action Button */}
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={goToLoginAfterRegistration}
                    style={{
                      padding: "13px 20px",
                      borderRadius: "11px",
                      fontSize: "0.9375rem",
                      fontWeight: 700,
                      boxShadow: "0 4px 14px rgba(15, 17, 21, 0.22)",
                    }}
                  >
                    Go to Sign In Page →
                  </Button>

                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#64748b",
                      fontWeight: 500,
                    }}
                  >
                    Auto-redirecting to Sign In...
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Customer "Verify Me" (Email ya Mobile) */}
          {customerMode === "verify_me" && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div style={{ fontSize: "0.8125rem", color: "#4b5563" }}>
                Verify your customer identity via instant One-Time Password
                (OTP) code sent to your <strong>Email</strong> or{" "}
                <strong>Mobile Phone</strong>.
              </div>

              {/* Step 1: Target & Method */}
              {otpStep === 1 && (
                <form
                  onSubmit={handleSendOtp}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "10px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setVerifyChannel("email");
                        setVerifyTarget("");
                      }}
                      style={{
                        padding: "10px",
                        borderRadius: "8px",
                        border:
                          verifyChannel === "email"
                            ? "2px solid #0f1115"
                            : "1px solid #d1d5db",
                        backgroundColor:
                          verifyChannel === "email" ? "#fafaf9" : "#ffffff",
                        fontWeight: verifyChannel === "email" ? 700 : 500,
                        fontSize: "0.75rem",
                        cursor: "pointer",
                      }}
                    >
                      ✉️ Email Code
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setVerifyChannel("mobile");
                        setVerifyTarget("");
                      }}
                      style={{
                        padding: "10px",
                        borderRadius: "8px",
                        border:
                          verifyChannel === "mobile"
                            ? "2px solid #0f1115"
                            : "1px solid #d1d5db",
                        backgroundColor:
                          verifyChannel === "mobile" ? "#fafaf9" : "#ffffff",
                        fontWeight: verifyChannel === "mobile" ? 700 : 500,
                        fontSize: "0.75rem",
                        cursor: "pointer",
                      }}
                    >
                      📱 Mobile SMS
                    </button>
                  </div>

                  <Input
                    label={
                      verifyChannel === "email"
                        ? "Registered Email"
                        : "Registered Mobile Number"
                    }
                    type={verifyChannel === "email" ? "email" : "tel"}
                    placeholder={
                      verifyChannel === "email"
                        ? "name@example.com"
                        : "+1 (555) 000-0000"
                    }
                    value={verifyTarget}
                    onChange={(e) => setVerifyTarget(e.target.value)}
                    required
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={isLoading}
                  >
                    Send Verification Code (OTP)
                  </Button>
                </form>
              )}

              {/* Step 2: Code Verification */}
              {otpStep === 2 && (
                <form
                  onSubmit={handleVerifyOtp}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#f3f4f6",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      fontSize: "0.75rem",
                    }}
                  >
                    Code sent to <strong>{verifyTarget}</strong>.

                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#374151",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      Enter 6-Digit OTP Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="000000"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        fontSize: "1.25rem",
                        letterSpacing: "0.25em",
                        textAlign: "center",
                        fontWeight: 700,
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                      }}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={isLoading}
                  >
                    Verify Me
                  </Button>
                </form>
              )}

              {/* Step 3: Verified — Auto-login */}
              {otpStep === 3 && (
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                  <div style={{ color: "#059669", marginBottom: "10px" }}>
                    <CheckCircleIcon size={44} />
                  </div>
                  <h3
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: 800,
                      color: "#111827",
                      marginBottom: "4px",
                    }}
                  >
                    Identity Verified!
                  </h3>
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      color: "#6b7280",
                      marginBottom: "18px",
                    }}
                  >
                    Your {verifyChannel === "email" ? "email" : "mobile phone"}{" "}
                    ({verifyTarget}) has been confirmed. Signing you in...
                  </p>
                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    loading={isLoading}
                    onClick={async () => {
                      setIsLoading(true);
                      try {
                        await login(verifyTarget, "otp_verified");
                        closeAuthModal();
                        showToast("Signed in successfully via OTP!", "success");
                      } catch (err) {
                        setError(err.message || "Login failed.");
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                  >
                    Continue to UrbanCart →
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Customer Forgot Password */}
          {customerMode === "forgot" && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <button
                type="button"
                onClick={() => switchCustomerMode("login")}
                style={{
                  alignSelf: "flex-start",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#6b7280",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  marginBottom: "2px",
                }}
              >
                ← Back to Sign In
              </button>
              {/* Step 1 */}
              {otpStep === 1 && (
                <form
                  onSubmit={handleSendOtp}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <label
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#374151",
                    }}
                  >
                    Select how to receive reset instructions:
                  </label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "10px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setVerifyChannel("email");
                        setVerifyTarget("");
                      }}
                      style={{
                        padding: "10px",
                        borderRadius: "8px",
                        border:
                          verifyChannel === "email"
                            ? "2px solid #0f1115"
                            : "1px solid #d1d5db",
                        backgroundColor:
                          verifyChannel === "email" ? "#fafaf9" : "#ffffff",
                        fontWeight: verifyChannel === "email" ? 700 : 500,
                        fontSize: "0.75rem",
                        cursor: "pointer",
                      }}
                    >
                      ✉️ Reset via Email
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setVerifyChannel("mobile");
                        setVerifyTarget("");
                      }}
                      style={{
                        padding: "10px",
                        borderRadius: "8px",
                        border:
                          verifyChannel === "mobile"
                            ? "2px solid #0f1115"
                            : "1px solid #d1d5db",
                        backgroundColor:
                          verifyChannel === "mobile" ? "#fafaf9" : "#ffffff",
                        fontWeight: verifyChannel === "mobile" ? 700 : 500,
                        fontSize: "0.75rem",
                        cursor: "pointer",
                      }}
                    >
                      📱 Reset via Mobile SMS
                    </button>
                  </div>

                  <Input
                    label={
                      verifyChannel === "email"
                        ? "Registered Email Address"
                        : "Registered Mobile Number"
                    }
                    type={verifyChannel === "email" ? "email" : "tel"}
                    placeholder={
                      verifyChannel === "email"
                        ? "name@example.com"
                        : "+1 (555) 000-0000"
                    }
                    value={verifyTarget}
                    onChange={(e) => setVerifyTarget(e.target.value)}
                    required
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={isLoading}
                  >
                    Send Reset Code
                  </Button>
                </form>
              )}

              {/* Step 2 */}
              {otpStep === 2 && (
                <form
                  onSubmit={handleVerifyOtp}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#f3f4f6",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      fontSize: "0.75rem",
                    }}
                  >
                    Verification code sent to <strong>{verifyTarget}</strong>.

                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#374151",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      Enter 6-Digit Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="000000"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        fontSize: "1.25rem",
                        letterSpacing: "0.25em",
                        textAlign: "center",
                        fontWeight: 700,
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                      }}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={isLoading}
                  >
                    Confirm Code
                  </Button>
                </form>
              )}

              {/* Step 3: New Password */}
              {otpStep === 3 && (
                <form
                  onSubmit={handleResetPassword}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.8125rem",
                      color: "#059669",
                      fontWeight: 600,
                    }}
                  >
                    ✓ Code verified. Enter your new customer password:
                  </div>

                  <Input
                    label="New Password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />

                  <Input
                    label="Confirm New Password"
                    type="password"
                    placeholder="Re-enter password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={isLoading}
                  >
                    Save New Password
                  </Button>
                </form>
              )}

              {/* Step 4: Done */}
              {otpStep === 4 && (
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                  <div style={{ color: "#059669", marginBottom: "10px" }}>
                    <CheckCircleIcon size={44} />
                  </div>
                  <h3
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: 800,
                      color: "#111827",
                    }}
                  >
                    Password Reset Complete!
                  </h3>
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      color: "#6b7280",
                      margin: "8px 0 16px 0",
                    }}
                  >
                    You can now sign in with your updated password.
                  </p>
                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    onClick={() => switchCustomerMode("login")}
                  >
                    Return to Sign In
                  </Button>
                </div>
              )}
            </div>
          )}


          {/* Small subtle option for Admin / Client (discreet footer) */}
          <div
            style={{
              marginTop: "16px",
              textAlign: "center",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setRole("admin");
                setAdminMode("login");
                setError("");
              }}
              style={{
                background: "#ffffff",
                border: "1.5px solid #cbd5e1",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#475569",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "8px",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.04)",
                transition: "all 0.18s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#94a3b8";
                e.currentTarget.style.backgroundColor = "#f8fafc";
                e.currentTarget.style.color = "#0f172a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#cbd5e1";
                e.currentTarget.style.backgroundColor = "#ffffff";
                e.currentTarget.style.color = "#475569";
              }}
            >
              <span>🔒</span>
              <span>Admin / Client Portal</span>
            </button>
          </div>
        </>
      )}

      {/* ===================================================================== */}
      {/* SECTION B: CLIENT ADMIN / STAFF PORTAL                                */}
      {/* ===================================================================== */}
      {role === "admin" && (
        <>
          {/* Subtle back to customer view */}
          <div style={{ marginBottom: "16px" }}>
            <button
              type="button"
              onClick={() => {
                setRole("customer");
                setCustomerMode("login");
                setError("");
              }}
              style={{
                background: "none",
                border: "none",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#6b7280",
                cursor: "pointer",
                padding: "4px 0",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              ← Back to Customer Account
            </button>
          </div>

          {/* Sub-navigation Tabs for Admin */}
          {adminMode !== "forgot" && (
            <div
              style={{
                display: "flex",
                backgroundColor: "#f3f4f6",
                borderRadius: "12px",
                padding: "4px",
                marginBottom: "22px",
              }}
            >
              {[
                { id: "login", label: "Sign In" },
                { id: "register", label: "Register" },
              ].map((tab) => {
                const isActive = adminMode === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => switchAdminMode(tab.id)}
                    style={{
                      flex: 1,
                      padding: "10px 16px",
                      fontSize: "0.875rem",
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? "#0f1115" : "#6b7280",
                      backgroundColor: isActive ? "#ffffff" : "transparent",
                      borderRadius: "9px",
                      border: "none",
                      cursor: "pointer",
                      boxShadow: isActive ? "0 2px 8px rgba(0, 0, 0, 0.08)" : "none",
                      transition: "all 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* B1. ADMIN LOGIN */}
          {adminMode === "login" && (
            <form
              onSubmit={handleAdminLogin}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <Input
                label="Admin Email or Mobile Phone"
                placeholder="admin@urbancart.com or +1 (555) 999-0192"
                value={adminIdentifier}
                onChange={(e) => setAdminIdentifier(e.target.value)}
                required
              />

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <label
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#374151",
                    }}
                  >
                    Admin Password <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => switchAdminMode("forgot")}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "0.75rem",
                      color: "#4b5563",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "color 0.15s ease",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#0f1115")}
                    onMouseLeave={(e) => (e.target.style.color = "#4b5563")}
                  >
                    Forgot admin pass?
                  </button>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    type={showAdminPass ? "text" : "password"}
                    placeholder="Enter admin password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "11px 44px 11px 14px",
                      fontSize: "0.875rem",
                      border: "1.5px solid #e5e7eb",
                      borderRadius: "10px",
                      outline: "none",
                      backgroundColor: "#fafaf9",
                      transition: "all 0.15s ease",
                      color: "#111827",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#0f1115";
                      e.target.style.backgroundColor = "#ffffff";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(15, 17, 21, 0.08)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e5e7eb";
                      e.target.style.backgroundColor = "#fafaf9";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPass(!showAdminPass)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      padding: "6px",
                      color: "#6b7280",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "6px",
                      transition: "color 0.15s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#111827")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#6b7280")
                    }
                    title={showAdminPass ? "Hide password" : "Show password"}
                  >
                    {showAdminPass ? (
                      <EyeOffIcon size={18} />
                    ) : (
                      <EyeIcon size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "0.8125rem",
                  color: "#4b5563",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={rememberAdmin}
                    onChange={(e) => setRememberAdmin(e.target.checked)}
                    style={{
                      width: "16px",
                      height: "16px",
                      accentColor: "#0f1115",
                      cursor: "pointer",
                    }}
                  />
                  <span>Remember admin session</span>
                </label>
                <button
                  type="button"
                  onClick={() => switchAdminMode("verify_me")}
                  style={{
                    backgroundColor: "#eff6ff",
                    border: "1px solid #bfdbfe",
                    borderRadius: "6px",
                    padding: "4px 10px",
                    color: "#2563eb",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#dbeafe";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#eff6ff";
                  }}
                >
                  <span>🛡️</span>
                  <span>Verify Admin (OTP)</span>
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                style={{
                  padding: "13px 20px",
                  borderRadius: "11px",
                  fontSize: "0.9375rem",
                  fontWeight: 700,
                  boxShadow: "0 4px 14px rgba(15, 17, 21, 0.22)",
                }}
              >
                Sign In to Admin Dashboard →
              </Button>
            </form>
          )}

          {/* B2. ADMIN / CLIENT REGISTRATION */}
          {adminMode === "register" && (
            <form
              onSubmit={handleAdminRegister}
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              <Input
                label="Full Name *"
                placeholder="e.g. Marcus Vance"
                value={adminRegName}
                onChange={(e) => setAdminRegName(e.target.value)}
                required
              />

              <Input
                label="Admin / Client Email *"
                type="email"
                placeholder="admin@urbancart.com"
                value={adminRegEmail}
                onChange={(e) => setAdminRegEmail(e.target.value)}
                required
              />

              <Input
                label="Mobile Phone Number"
                type="tel"
                placeholder="+1 (555) 999-0192"
                value={adminRegPhone}
                onChange={(e) => setAdminRegPhone(e.target.value)}
              />

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#374151",
                  }}
                >
                  Admin Password <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showAdminRegPass ? "text" : "password"}
                    placeholder="At least 6 characters"
                    value={adminRegPassword}
                    onChange={(e) => setAdminRegPassword(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "11px 44px 11px 14px",
                      fontSize: "0.875rem",
                      border: "1.5px solid #e5e7eb",
                      borderRadius: "10px",
                      outline: "none",
                      backgroundColor: "#fafaf9",
                      transition: "all 0.15s ease",
                      color: "#111827",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#0f1115";
                      e.target.style.backgroundColor = "#ffffff";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(15, 17, 21, 0.08)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e5e7eb";
                      e.target.style.backgroundColor = "#fafaf9";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminRegPass(!showAdminRegPass)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      padding: "6px",
                      color: "#6b7280",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "6px",
                      transition: "color 0.15s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#111827")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#6b7280")
                    }
                    title={showAdminRegPass ? "Hide password" : "Show password"}
                  >
                    {showAdminRegPass ? (
                      <EyeOffIcon size={18} />
                    ) : (
                      <EyeIcon size={18} />
                    )}
                  </button>
                </div>
              </div>

              <Input
                label="Confirm Admin Password *"
                type="password"
                placeholder="Re-enter admin password"
                value={adminRegConfirmPass}
                onChange={(e) => setAdminRegConfirmPass(e.target.value)}
                required
              />

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#374151",
                  }}
                >
                  Staff Authorization Key <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. URBANCART-ADMIN"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    fontSize: "0.875rem",
                    border: "1.5px solid #e5e7eb",
                    borderRadius: "10px",
                    outline: "none",
                    backgroundColor: "#fafaf9",
                    transition: "all 0.15s ease",
                    color: "#111827",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#0f1115";
                    e.target.style.backgroundColor = "#ffffff";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(15, 17, 21, 0.08)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.backgroundColor = "#fafaf9";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <span
                  style={{
                    fontSize: "0.6875rem",
                    color: "#059669",
                    display: "block",
                    marginTop: "2px",
                  }}
                >
                  Default key: <strong>URBANCART-ADMIN</strong>
                </span>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                style={{
                  marginTop: "4px",
                  padding: "13px 20px",
                  borderRadius: "11px",
                  fontSize: "0.9375rem",
                  fontWeight: 700,
                  boxShadow: "0 4px 14px rgba(15, 17, 21, 0.22)",
                }}
              >
                Register as Admin / Client →
              </Button>

              <div
                style={{
                  textAlign: "center",
                  marginTop: "8px",
                  fontSize: "0.75rem",
                  color: "#6b7280",
                }}
              >
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => switchAdminMode("login")}
                  style={{
                    fontWeight: 800,
                    color: "#0f1115",
                    textDecoration: "underline",
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                  }}
                >
                  Sign In to Admin
                </button>
              </div>
            </form>
          )}

          {/* B3. ADMIN "VERIFY ME" (EMAIL YA MOBILE) */}
          {adminMode === "verify_me" && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div style={{ fontSize: "0.8125rem", color: "#4b5563" }}>
                Verify your administrative security token using 2-Factor
                Authentication via <strong>Email</strong> or{" "}
                <strong>Mobile Phone</strong>.
              </div>

              {/* Step 1: Channel & Contact */}
              {otpStep === 1 && (
                <form
                  onSubmit={handleSendOtp}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "10px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setVerifyChannel("email");
                        setVerifyTarget("");
                      }}
                      style={{
                        padding: "10px",
                        borderRadius: "8px",
                        border:
                          verifyChannel === "email"
                            ? "2px solid #0f1115"
                            : "1px solid #d1d5db",
                        backgroundColor:
                          verifyChannel === "email" ? "#fafaf9" : "#ffffff",
                        fontWeight: verifyChannel === "email" ? 700 : 500,
                        fontSize: "0.75rem",
                        cursor: "pointer",
                      }}
                    >
                      ✉️ Admin Email
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setVerifyChannel("mobile");
                        setVerifyTarget("");
                      }}
                      style={{
                        padding: "10px",
                        borderRadius: "8px",
                        border:
                          verifyChannel === "mobile"
                            ? "2px solid #0f1115"
                            : "1px solid #d1d5db",
                        backgroundColor:
                          verifyChannel === "mobile" ? "#fafaf9" : "#ffffff",
                        fontWeight: verifyChannel === "mobile" ? 700 : 500,
                        fontSize: "0.75rem",
                        cursor: "pointer",
                      }}
                    >
                      📱 Admin Mobile SMS
                    </button>
                  </div>

                  <Input
                    label={
                      verifyChannel === "email"
                        ? "Admin Email Address"
                        : "Admin Mobile Number"
                    }
                    type={verifyChannel === "email" ? "email" : "tel"}
                    placeholder={
                      verifyChannel === "email"
                        ? "admin@urbancart.com"
                        : "+1 (555) 999-0192"
                    }
                    value={verifyTarget}
                    onChange={(e) => setVerifyTarget(e.target.value)}
                    required
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={isLoading}
                  >
                    Send Admin OTP Code
                  </Button>
                </form>
              )}

              {/* Step 2: Code Verification */}
              {otpStep === 2 && (
                <form
                  onSubmit={handleVerifyOtp}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#f3f4f6",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      fontSize: "0.75rem",
                    }}
                  >
                    Admin verification token dispatched to{" "}
                    <strong>{verifyTarget}</strong>.

                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#374151",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      Enter 6-Digit Admin Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="000000"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        fontSize: "1.25rem",
                        letterSpacing: "0.25em",
                        textAlign: "center",
                        fontWeight: 700,
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                      }}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={isLoading}
                  >
                    Verify Admin Identity
                  </Button>
                </form>
              )}

              {/* Step 3: Admin Verified! */}
              {otpStep === 3 && (
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                  <div style={{ color: "#059669", marginBottom: "10px" }}>
                    <ShieldCheckIcon size={44} />
                  </div>
                  <h3
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: 800,
                      color: "#111827",
                      marginBottom: "4px",
                    }}
                  >
                    Admin Clearance Granted!
                  </h3>
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      color: "#6b7280",
                      marginBottom: "18px",
                    }}
                  >
                    Identity verified for {verifyTarget}. Backoffice permissions
                    authenticated.
                  </p>
                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    onClick={() => {
                      switchAdminMode("login");
                      setAdminIdentifier(verifyTarget);
                    }}
                  >
                    Proceed to Admin Sign In
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* B4. ADMIN FORGOT PASSWORD */}
          {adminMode === "forgot" && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <button
                type="button"
                onClick={() => switchAdminMode("login")}
                style={{
                  alignSelf: "flex-start",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#6b7280",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  marginBottom: "2px",
                }}
              >
                ← Back to Admin Login
              </button>
              {/* Step 1 */}
              {otpStep === 1 && (
                <form
                  onSubmit={handleSendOtp}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <label
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#374151",
                    }}
                  >
                    Choose channel for admin password reset code:
                  </label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "10px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setVerifyChannel("email");
                        setVerifyTarget("");
                      }}
                      style={{
                        padding: "10px",
                        borderRadius: "8px",
                        border:
                          verifyChannel === "email"
                            ? "2px solid #0f1115"
                            : "1px solid #d1d5db",
                        backgroundColor:
                          verifyChannel === "email" ? "#fafaf9" : "#ffffff",
                        fontWeight: verifyChannel === "email" ? 700 : 500,
                        fontSize: "0.75rem",
                        cursor: "pointer",
                      }}
                    >
                      ✉️ Reset via Email
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setVerifyChannel("mobile");
                        setVerifyTarget("");
                      }}
                      style={{
                        padding: "10px",
                        borderRadius: "8px",
                        border:
                          verifyChannel === "mobile"
                            ? "2px solid #0f1115"
                            : "1px solid #d1d5db",
                        backgroundColor:
                          verifyChannel === "mobile" ? "#fafaf9" : "#ffffff",
                        fontWeight: verifyChannel === "mobile" ? 700 : 500,
                        fontSize: "0.75rem",
                        cursor: "pointer",
                      }}
                    >
                      📱 Reset via Mobile SMS
                    </button>
                  </div>

                  <Input
                    label={
                      verifyChannel === "email"
                        ? "Registered Admin Email"
                        : "Registered Admin Mobile"
                    }
                    type={verifyChannel === "email" ? "email" : "tel"}
                    placeholder={
                      verifyChannel === "email"
                        ? "admin@urbancart.com"
                        : "+1 (555) 999-0192"
                    }
                    value={verifyTarget}
                    onChange={(e) => setVerifyTarget(e.target.value)}
                    required
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={isLoading}
                  >
                    Send Admin Reset Code
                  </Button>
                </form>
              )}

              {/* Step 2 */}
              {otpStep === 2 && (
                <form
                  onSubmit={handleVerifyOtp}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#f3f4f6",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      fontSize: "0.75rem",
                    }}
                  >
                    Reset code sent to <strong>{verifyTarget}</strong>.

                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#374151",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      Enter 6-Digit Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="000000"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        fontSize: "1.25rem",
                        letterSpacing: "0.25em",
                        textAlign: "center",
                        fontWeight: 700,
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                      }}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={isLoading}
                  >
                    Confirm Admin Code
                  </Button>
                </form>
              )}

              {/* Step 3: New Password */}
              {otpStep === 3 && (
                <form
                  onSubmit={handleResetPassword}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.8125rem",
                      color: "#059669",
                      fontWeight: 600,
                    }}
                  >
                    ✓ Identity confirmed. Set new administrative password:
                  </div>

                  <Input
                    label="New Admin Password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />

                  <Input
                    label="Confirm New Password"
                    type="password"
                    placeholder="Re-enter password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={isLoading}
                  >
                    Save New Password
                  </Button>
                </form>
              )}

              {/* Step 4: Done */}
              {otpStep === 4 && (
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                  <div style={{ color: "#059669", marginBottom: "10px" }}>
                    <CheckCircleIcon size={44} />
                  </div>
                  <h3
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: 800,
                      color: "#111827",
                    }}
                  >
                    Admin Password Updated!
                  </h3>
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      color: "#6b7280",
                      margin: "8px 0 16px 0",
                    }}
                  >
                    You can now sign in to the operations console with your new
                    credentials.
                  </p>
                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    onClick={() => switchAdminMode("login")}
                  >
                    Proceed to Admin Sign In
                  </Button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </Modal>
  );
};
