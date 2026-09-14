import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import {
  ShieldCheckIcon,
  TruckIcon,
  RotateCcwIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from "./Icons";

// Import dedicated component stylesheet
import "./Footer.css";

/**
 * ============================================================================
 * Footer Component — Step-by-Step Modular Architecture
 * ============================================================================
 * 
 * Purpose:
 *   Editorial dark-mode footer rendered at the bottom of storefront pages.
 *   Provides VIP Atelier newsletter dispatch, 4-column navigation directory,
 *   customer care quick links, security/authenticity badges, and smooth scroll to top.
 */

/* ─── Custom SVG Social Icons ────────────────────────────────────────── */
const InstagramSvg = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TwitterSvg = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const PinterestSvg = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const YoutubeSvg = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const ArrowUpSvg = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);

export const Footer = ({ hideNewsletter = false }) => {
  const {
    setActiveView,
    activeView,
    openShopCatalog,
    openCartPage,
    openWishlist,
    openAccount,
    setIsCurrencyModalOpen,
    currency,
    CURRENCY_CONFIG,
    currentUser,
    wishlist = [],
    showToast
  } = useStore();

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes("@")) {
      showToast("Please provide a valid email address.", "info");
      return;
    }

    setSubscribing(true);
    setTimeout(() => {
      setSubscribing(false);
      setIsSubscribed(true);
      showToast("Privilege membership confirmed! Use code WELCOME10 for 10% off.", "success");
    }, 600);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      style={{
        backgroundColor: "#07080a",
        color: "#ffffff",
        position: "relative",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        overflow: "hidden",
        fontFamily: "var(--font-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)",
      }}
    >
      {/* Subtle Ambient Radial Glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "1000px",
          height: "320px",
          background: "radial-gradient(circle, rgba(255, 255, 255, 0.035) 0%, rgba(255, 255, 255, 0) 70%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 2, padding: "0 24px" }}>
        
        {/* ===================================================================== */}
        {/* 1. TOP VIP ATELIER DISPATCH / NEWSLETTER CARD                         */}
        {/* ===================================================================== */}
        {(!hideNewsletter && activeView !== "storefront") && (
        <div
          style={{
            margin: "56px 0 64px 0",
            padding: "36px 40px",
            borderRadius: "20px",
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.015) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "28px",
          }}
        >
          <div style={{ maxWidth: "520px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "0.6875rem",
                fontWeight: 800,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#fbbf24",
                backgroundColor: "rgba(251, 191, 36, 0.1)",
                border: "1px solid rgba(251, 191, 36, 0.25)",
                padding: "4px 10px",
                borderRadius: "9999px",
                marginBottom: "14px",
              }}
            >
              <span aria-hidden="true">✦</span>
              <span>The Atelier Circle • Private Client Invitation</span>
            </div>
            <h3
              style={{
                fontSize: "1.625rem",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#ffffff",
                marginBottom: "8px",
                lineHeight: 1.2,
              }}
            >
              Curated acquisitions delivered to your inbox.
            </h3>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#d4d4d8",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Join 42,000+ patrons receiving exclusive vault releases, private seasonal drops, and <strong style={{ color: "#ffffff" }}>10% off</strong> your inaugural order.
            </p>
          </div>

          {/* Subscription Action Form */}
          <div style={{ flex: "1 1 360px", maxWidth: "460px" }}>
            {!isSubscribed ? (
              <form
                onSubmit={handleSubscribe}
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "rgba(20, 22, 28, 0.9)",
                  border: "1.5px solid rgba(255, 255, 255, 0.14)",
                  borderRadius: "14px",
                  padding: "4px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                  transition: "border-color 0.2s ease",
                }}
              >
                <label htmlFor="footer-newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="footer-newsletter-email"
                  type="email"
                  aria-label="Enter your email address for newsletter subscription"
                  placeholder="Enter your email address..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    padding: "10px 16px",
                    color: "#ffffff",
                    fontSize: "0.875rem",
                  }}
                  required
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#0a0b0e",
                    border: "none",
                    borderRadius: "10px",
                    padding: "11px 20px",
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    cursor: subscribing ? "wait" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    whiteSpace: "nowrap",
                    boxShadow: "0 2px 10px rgba(255, 255, 255, 0.15)",
                    transition: "all 0.18s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#e4e4e7";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#ffffff";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <span>{subscribing ? "Subscribing..." : "Claim 10% Off"}</span>
                  <ArrowRightIcon size={14} />
                </button>
              </form>
            ) : (
              <div
                style={{
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  borderRadius: "14px",
                  padding: "14px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <CheckCircleIcon size={20} color="#10b981" />
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#10b981" }}>
                    Welcome to The Atelier Circle!
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#d1fae5", marginTop: "2px" }}>
                    Use code <span style={{ fontWeight: 800, textDecoration: "underline" }}>WELCOME10</span> at checkout for 10% off.
                  </div>
                </div>
              </div>
            )}
            <div
              style={{
                fontSize: "0.6875rem",
                color: "#a1a1aa",
                marginTop: "10px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span aria-hidden="true">🔒</span>
              <span>Direct from Atelier • Zero spam • Unsubscribe anytime</span>
            </div>
          </div>
        </div>
        )}

        {/* ===================================================================== */}
        {/* 2. MAIN 4-COLUMN LUXURY GRID                                          */}
        {/* ===================================================================== */}
        <div
          className="footer-main-grid"
          style={{
            paddingBottom: "56px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
          }}
        >
          {/* ---------------- Column 1: Atelier Brand ---------------- */}
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "14px",
                marginBottom: "20px",
                cursor: "pointer",
              }}
              onClick={() => setActiveView("storefront")}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#ffffff",
                  background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)",
                  color: "#0a0b0e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: "0.9375rem",
                  letterSpacing: "-0.03em",
                  borderRadius: "11px",
                  boxShadow: "0 4px 14px rgba(255, 255, 255, 0.18)",
                }}
              >
                UC
              </div>
              <div>
                <span
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 900,
                    letterSpacing: "-0.03em",
                    color: "#ffffff",
                    display: "block",
                    lineHeight: 1.1,
                  }}
                >
                  URBANCART
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#a1a1aa",
                    fontWeight: 700,
                  }}
                >
                  EDITORIAL GOODS &amp; ATELIER
                </span>
              </div>
            </div>

            <p
              style={{
                fontSize: "0.8125rem",
                color: "#a1a1aa",
                maxWidth: "340px",
                lineHeight: 1.7,
                marginBottom: "20px",
              }}
            >
              Timeless by design. Exceptional by nature. Explore an archival collection of wardrobe essentials, horology, and lifestyle objects crafted for disciplined modern living.
            </p>

            {/* Live Operations & Flagship Pill */}
            <div
              style={{
                display: "inline-flex",
                flexDirection: "column",
                gap: "6px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "0.6875rem",
                  fontWeight: 600,
                  color: "#e4e4e7",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  padding: "5px 12px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  width: "fit-content",
                }}
              >
                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    backgroundColor: "#10b981",
                    boxShadow: "0 0 8px #10b981",
                    display: "inline-block",
                  }}
                />
                <span>Live Dispatch Active • 140+ Countries</span>
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.6875rem",
                  color: "#9ca3af",
                  padding: "0 4px",
                }}
              >
                <span style={{ color: "#d97706" }}>📍</span>
                <span>Nagpur Flagship &amp; Global Craft Studios</span>
              </div>
            </div>

            {/* Real SVG Social Links */}
            <div>
              <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
                Connect with the Studio
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                {[
                  { name: "Instagram", icon: <InstagramSvg /> },
                  { name: "Twitter", icon: <TwitterSvg /> },
                  { name: "Pinterest", icon: <PinterestSvg /> },
                  { name: "YouTube", icon: <YoutubeSvg /> },
                ].map((social, idx) => (
                  <button
                    key={idx}
                    type="button"
                    title={social.name}
                    aria-label={social.name}
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "10px",
                      backgroundColor: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "#d4d4d8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffffff";
                      e.currentTarget.style.color = "#0a0b0e";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 4px 14px rgba(255, 255, 255, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.06)";
                      e.currentTarget.style.color = "#d4d4d8";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {social.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ---------------- Column 2: Collections ---------------- */}
          <div>
            <div
              style={{
                fontSize: "0.6875rem",
                fontWeight: 800,
                letterSpacing: "0.14em",
                color: "#a1a1aa",
                textTransform: "uppercase",
                marginBottom: "22px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span style={{ color: "#d97706" }}>01</span>
              <span>The Collections</span>
            </div>
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                fontSize: "0.8125rem",
                padding: 0,
                margin: 0,
              }}
            >
              {[
                { label: "Premium Footwear & Sneakers", action: () => openShopCatalog("Premium Sneakers") },
                { label: "Horology & Ceramic Watches", action: () => openShopCatalog("Smart Watches") },
                { label: "Technical Carry & Daypacks", action: () => openShopCatalog("Backpacks") },
                { label: "Studio Headphones & Audio", action: () => openShopCatalog("Headphones") },
                { label: "Athletic & Fitness Gear", action: () => openShopCatalog("Fitness Accessories") },
                {
                  label: "Curated Wishlist",
                  badge: currentUser && wishlist.length > 0 ? `${wishlist.length}` : null,
                  action: openWishlist,
                },
                { label: "Shopping Bag & Cart", action: openCartPage },
              ].map((item, idx) => (
                <li
                  key={idx}
                  style={{
                    color: "#9ca3af",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "all 0.18s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#ffffff";
                    e.currentTarget.style.transform = "translateX(5px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#9ca3af";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                  onClick={item.action}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      style={{
                        backgroundColor: "#ffffff",
                        color: "#0a0b0e",
                        fontSize: "0.625rem",
                        fontWeight: 800,
                        padding: "2px 6px",
                        borderRadius: "9999px",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* ---------------- Column 3: Client Care ---------------- */}
          <div>
            <div
              style={{
                fontSize: "0.6875rem",
                fontWeight: 800,
                letterSpacing: "0.14em",
                color: "#a1a1aa",
                textTransform: "uppercase",
                marginBottom: "22px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span style={{ color: "#d97706" }}>02</span>
              <span>Client Concierge</span>
            </div>
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                fontSize: "0.8125rem",
                padding: 0,
                margin: 0,
                marginBottom: "24px",
              }}
            >
              {[
                { label: "About Us & Manifesto", action: () => setActiveView("about") },
                { label: "Contact Concierge Desk", action: () => setActiveView("contact") },
                { label: "Frequently Asked Questions", action: () => setActiveView("faq") },
                { label: "Patron Account & Orders", action: openAccount },
                { label: "Operations Admin Portal", action: () => setActiveView("admin_dashboard") },
              ].map((item, idx) => (
                <li
                  key={idx}
                  style={{
                    color: "#9ca3af",
                    cursor: "pointer",
                    transition: "all 0.18s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#ffffff";
                    e.currentTarget.style.transform = "translateX(5px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#9ca3af";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                  onClick={item.action}
                >
                  {item.label}
                </li>
              ))}
            </ul>

            {/* Concierge Hotline Card */}
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.07)",
                borderRadius: "12px",
                padding: "12px 14px",
                fontSize: "0.75rem",
              }}
            >
              <div style={{ fontWeight: 700, color: "#ffffff", marginBottom: "2px" }}>
                Direct Concierge Desk
              </div>
              <div style={{ color: "#a1a1aa", fontSize: "0.6875rem", lineHeight: 1.5 }}>
                Mon – Sat, 9:00 AM – 8:00 PM EST
              </div>
              <div style={{ color: "#fbbf24", fontWeight: 600, marginTop: "4px" }}>
                concierge@urbancart.com
              </div>
            </div>
          </div>

          {/* ---------------- Column 4: Atelier Guarantees & Trust ---------------- */}
          <div>
            <div
              style={{
                fontSize: "0.6875rem",
                fontWeight: 800,
                letterSpacing: "0.14em",
                color: "#a1a1aa",
                textTransform: "uppercase",
                marginBottom: "22px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span style={{ color: "#d97706" }}>03</span>
              <span>The Atelier Promise</span>
            </div>

            {/* Clean, balanced guarantee list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <div style={{ color: "#d97706", display: "flex", alignItems: "center" }}>
                  <TruckIcon size={16} />
                </div>
                <span style={{ fontSize: "0.8125rem", color: "#d4d4d8", fontWeight: 500 }}>
                  Worldwide Express Courier Dispatch
                </span>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <div style={{ color: "#10b981", display: "flex", alignItems: "center" }}>
                  <ShieldCheckIcon size={16} />
                </div>
                <span style={{ fontSize: "0.8125rem", color: "#d4d4d8", fontWeight: 500 }}>
                  Artisan Craftsmanship &amp; Gold LWG Certified
                </span>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <div style={{ color: "#3b82f6", display: "flex", alignItems: "center" }}>
                  <RotateCcwIcon size={16} />
                </div>
                <span style={{ fontSize: "0.8125rem", color: "#d4d4d8", fontWeight: 500 }}>
                  30-Day Effortless Returns &amp; Exchanges
                </span>
              </div>
            </div>

            {/* Payment Trust Badges */}
            <div>
              <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                Encrypted Payment Gateways
              </div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {["VISA", "MASTERCARD", "AMEX", "APPLE PAY", "GOOGLE PAY", "UPI", "PAYPAL"].map((gateway, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      letterSpacing: "0.06em",
                      color: "rgba(255, 255, 255, 0.8)",
                      backgroundColor: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.14)";
                      e.currentTarget.style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.06)";
                      e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
                    }}
                  >
                    {gateway}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 3. BOTTOM LEGAL, REGION SWITCHER & SCROLL TO TOP                      */}
        {/* ===================================================================== */}
        <div
          style={{
            padding: "32px 0 44px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.75rem",
            color: "#a1a1aa",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            © {new Date().getFullYear()} <strong style={{ color: "#ffffff" }}>UrbanCart Atelier Inc.</strong> All rights reserved. Master Catalog v4.12
          </div>

          {/* Legal Navigation Links */}
          <div style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              style={{
                background: "none",
                border: "none",
                padding: 0,
                font: "inherit",
                fontSize: "0.75rem",
                color: "#a1a1aa",
                cursor: "pointer",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#a1a1aa")}
              onClick={() => setActiveView("privacy")}
            >
              Privacy Shield
            </button>
            <button
              type="button"
              style={{
                background: "none",
                border: "none",
                padding: 0,
                font: "inherit",
                fontSize: "0.75rem",
                color: "#a1a1aa",
                cursor: "pointer",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#a1a1aa")}
              onClick={() => setActiveView("terms")}
            >
              Terms of Acquisition
            </button>
            <button
              type="button"
              style={{
                background: "none",
                border: "none",
                padding: 0,
                font: "inherit",
                fontSize: "0.75rem",
                color: "#a1a1aa",
                cursor: "pointer",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#a1a1aa")}
              onClick={() => setActiveView("about")}
            >
              Ethical Provenance
            </button>

            {/* Currency & Region Selector Button */}
            <button
              type="button"
              onClick={() => setIsCurrencyModalOpen(true)}
              style={{
                fontSize: "0.6875rem",
                fontWeight: 700,
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                padding: "4px 10px",
                borderRadius: "6px",
                color: "#e4e4e7",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.color = "#e4e4e7";
              }}
              title="Select region and preferred currency"
            >
              <span>🌐 {CURRENCY_CONFIG?.[currency]?.label || 'INR (₹) • India'}</span>
              <span aria-hidden="true" style={{ fontSize: "0.625rem" }}>▾</span>
            </button>

            {/* Back to Top */}
            <button
              type="button"
              onClick={scrollToTop}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "transparent",
                border: "1px solid rgba(255, 255, 255, 0.14)",
                borderRadius: "6px",
                padding: "4px 10px",
                color: "#a1a1aa",
                fontSize: "0.6875rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.18s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#ffffff";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.14)";
                e.currentTarget.style.color = "#a1a1aa";
                e.currentTarget.style.transform = "translateY(0)";
              }}
              title="Scroll back to top"
            >
              <span>Back to Top</span>
              <ArrowUpSvg />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
