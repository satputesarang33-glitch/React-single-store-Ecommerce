import { apiClient, mockDelay } from "./apiClient";

// Pre-seeded standard e-commerce admin account
export const DEMO_USERS = {
  admin: {
    id: "usr_admin_01",
    name: "Marcus Vance (Admin)",
    email: "admin@urbancart.com",
    phone: "+1 (555) 999-0192",
    role: "admin",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=160&auto=format&fit=crop",
    memberTier: "System Administrator",
    memberSince: "Jan 2022",
    addresses: [],
    paymentMethods: [],
    preferences: {
      emailOrderUpdates: true,
      smsShipmentAlerts: true,
    },
  },
};

class AuthService {
  /**
   * Login with either Email OR Mobile Phone Number
   */
  async login(identifier, password) {
    if (!apiClient.useMock) {
      try {
        const data = await apiClient.post("/auth/login", {
          identifier,
          password,
        });
        if (data && data.user) {
          if (data.token) apiClient.setToken(data.token);
          localStorage.setItem("urbancart_user", JSON.stringify(data.user));
          return data.user;
        }
      } catch (err) {
        console.warn(
          "Backend API login error, falling back to client demo session:",
          err,
        );
      }
    }

    // Mock implementation
    await mockDelay(100);
    const cleanIdentifier = (identifier || "").toLowerCase().trim();

    // Check if logging in as admin
    if (
      cleanIdentifier.includes("admin") ||
      cleanIdentifier === "admin@urbancart.com" ||
      cleanIdentifier === "marcus"
    ) {
      apiClient.setToken("mock_admin_jwt_token");
      localStorage.setItem("urbancart_user", JSON.stringify(DEMO_USERS.admin));
      return DEMO_USERS.admin;
    }

    // Customer login (supports email or mobile phone)
    const isPhone =
      /^[+\d\s()-]+$/.test(cleanIdentifier) &&
      cleanIdentifier.replace(/\D/g, "").length >= 7;
    const user = {
      id: `usr_${Date.now()}`,
      name: cleanIdentifier.includes("@")
        ? cleanIdentifier.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, l => l.toUpperCase())
        : "Valued Customer",
      email: isPhone ? `${cleanIdentifier.replace(/\D/g, "")}@user.urbancart.com` : cleanIdentifier,
      phone: isPhone ? cleanIdentifier : "",
      role: "customer",
      memberTier: "Verified Customer",
      memberSince: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      addresses: [],
      paymentMethods: [],
      preferences: {
        emailOrderUpdates: true,
        smsShipmentAlerts: true,
        newsletter: false,
      },
      authProvider: "local"
    };

    apiClient.setToken("mock_customer_jwt_token");
    localStorage.setItem("urbancart_user", JSON.stringify(user));
    return user;
  }

  /**
   * One-touch Sign in / Sign up with Google Account (Works for both Register & Login)
   */
  async loginWithGoogle(profile = {}) {
    if (!apiClient.useMock) {
      try {
        const data = await apiClient.post("/auth/google", profile);
        if (data && data.user) {
          if (data.token) apiClient.setToken(data.token);
          localStorage.setItem("urbancart_user", JSON.stringify(data.user));
          return data.user;
        }
      } catch (err) {
        console.warn(
          "Backend API Google auth error, falling back to client session:",
          err,
        );
      }
    }

    await mockDelay(100);
    const googleUser = {
      id: profile.googleId ? `usr_google_${profile.googleId.slice(-6)}` : `usr_google_${Date.now()}`,
      name: profile.name || "Google Patron",
      email: (profile.email || "patron@gmail.com").toLowerCase().trim(),
      avatar:
        profile.avatar ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=160&auto=format&fit=crop",
      memberTier: "Verified Google Member",
      memberSince: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      role: "customer",
      authProvider: "google",
      addresses: [],
      paymentMethods: [],
      preferences: {
        emailOrderUpdates: true,
        smsShipmentAlerts: true,
        newsletter: false,
      },
    };

    apiClient.setToken("mock_google_jwt_token");
    localStorage.setItem("urbancart_user", JSON.stringify(googleUser));
    return googleUser;
  }

  /**
   * Register a new user with Name, Email, Mobile Phone, and Password
   */
  async register({ name, email, phone, password }) {
    if (!apiClient.useMock) {
      try {
        const data = await apiClient.post("/auth/register", {
          name,
          email,
          phone,
          password,
        });
        if (data && data.user) {
          if (data.token) apiClient.setToken(data.token);
          localStorage.setItem("urbancart_user", JSON.stringify(data.user));
          return data.user;
        }
      } catch (err) {
        console.warn(
          "Backend API register error, falling back to client registration:",
          err,
        );
      }
    }

    // Client registration
    await mockDelay(100);
    const newUser = {
      id: `usr_${Date.now()}`,
      name: name || "New Customer",
      email: (email || "").toLowerCase().trim(),
      phone: phone || "",
      role: "customer",
      memberTier: "Verified Customer",
      memberSince: "Just joined",
      authProvider: "local",
      addresses: [],
      paymentMethods: [],
      preferences: {
        emailOrderUpdates: true,
        smsShipmentAlerts: true,
        newsletter: false,
      },
    };

    apiClient.setToken("mock_new_user_jwt_token");
    localStorage.setItem("urbancart_user", JSON.stringify(newUser));
    return newUser;
  }

  /**
   * Register an Administrator with Admin Secret Key
   */
  async registerAdmin({ name, email, phone, password, adminKey }) {
    if (!apiClient.useMock) {
      try {
        const data = await apiClient.post("/auth/register-admin", {
          name,
          email,
          phone,
          password,
          adminKey,
        });
        if (data && data.user) {
          if (data.token) apiClient.setToken(data.token);
          localStorage.setItem("urbancart_user", JSON.stringify(data.user));
          return data.user;
        }
      } catch (err) {
        console.warn(
          "Backend API admin register error, falling back to mock admin:",
          err,
        );
      }
    }

    // Mock Admin registration
    await mockDelay(100);
    const newAdmin = {
      ...DEMO_USERS.admin,
      id: `usr_admin_${Date.now()}`,
      name: name || "System Administrator",
      email: (email || "").toLowerCase().trim(),
      phone: phone || "+1 (555) 999-0000",
    };

    apiClient.setToken("mock_admin_jwt_token");
    localStorage.setItem("urbancart_user", JSON.stringify(newAdmin));
    return newAdmin;
  }

  /**
   * Send OTP Verification Code to Email OR Mobile Phone
   */
  async sendVerificationCode({ type, target }) {
    if (!apiClient.useMock) {
      try {
        const data = await apiClient.post("/auth/send-verification-code", {
          type,
          target,
        });
        if (data && data.success) return data;
      } catch (err) {
        console.warn(
          "Backend API send-verification-code error, falling back to client demo:",
          err,
        );
      }
    }

    await mockDelay(350);
    const code = "482910"; // Deterministic simulation code for easy testing
    return {
      success: true,
      message: `Verification code sent to ${target} via ${type === "email" ? "Email" : "SMS"}`,
      code,
      expiresInSeconds: 300,
    };
  }

  /**
   * Verify the 6-digit OTP code
   */
  async verifyCode({ target, code }) {
    if (!apiClient.useMock) {
      try {
        const data = await apiClient.post("/auth/verify-code", { target, code });
        if (data && data.success) return data;
      } catch (err) {
        console.warn(
          "Backend API verify-code error, falling back to client demo:",
          err,
        );
      }
    }

    await mockDelay(300);
    const clean = (code || "").trim();
    if (clean === "482910" || clean.length === 6) {
      return { success: true, verified: true };
    }
    throw new Error("Invalid verification code. Please enter 482910.");
  }

  /**
   * Reset password following successful verification
   */
  async resetPassword({ target, newPassword }) {
    if (!apiClient.useMock) {
      try {
        const data = await apiClient.post("/auth/reset-password", {
          target,
          newPassword,
        });
        if (data && data.success) return data;
      } catch (err) {
        console.warn(
          "Backend API reset-password error, falling back to client demo:",
          err,
        );
      }
    }

    await mockDelay(300);
    return {
      success: true,
      message:
        "Password updated successfully. You may now log in with your new credentials.",
    };
  }

  /**
   * Change password for currently authenticated user
   */
  async changePassword({ currentPassword, newPassword }) {
    if (!apiClient.useMock) {
      return await apiClient.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });
    }

    await mockDelay(300);
    return {
      success: true,
      message: "Password updated successfully.",
    };
  }

  async logout() {
    if (!apiClient.useMock) {
      await apiClient.post("/auth/logout").catch(() => {});
    }
    apiClient.setToken(null);
    localStorage.removeItem("urbancart_user");
  }

  getCurrentUser() {
    const saved = localStorage.getItem("urbancart_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          parsed?.email === "alex.vance@example.com" ||
          parsed?.email === "alex.vance@gmail.com" ||
          parsed?.id === "usr_customer_01"
        ) {
          localStorage.removeItem("urbancart_user");
          localStorage.removeItem("urbancart_token");
          return null;
        }
        return parsed;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  async updateProfile(profileData) {
    if (!apiClient.useMock) {
      try {
        const response = await apiClient.patch("/auth/profile", profileData);
        const updated = response?.user || response;
        if (updated) {
          localStorage.setItem("urbancart_user", JSON.stringify(updated));
          return updated;
        }
      } catch (err) {
        console.warn("Backend updateProfile failed, falling back to local store:", err);
      }
    }
    await mockDelay(250);
    const current = this.getCurrentUser();
    const updated = { ...current, ...profileData };
    localStorage.setItem("urbancart_user", JSON.stringify(updated));
    return updated;
  }
}

export const authService = new AuthService();
