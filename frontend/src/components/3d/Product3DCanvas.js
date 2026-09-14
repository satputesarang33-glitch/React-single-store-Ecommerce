import React, { useState, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";

import { Sneaker3DModel } from "./models/Sneaker3DModel";
import { Watch3DModel } from "./models/Watch3DModel";
import { Apparel3DModel } from "./models/Apparel3DModel";
import { GenericProduct3DModel } from "./models/GenericProduct3DModel";

/**
 * Lighting presets for the 3D studio experience
 */
const LIGHT_PRESETS = {
  studio: {
    name: "Day Studio",
    ambient: "#ffffff",
    ambientIntensity: 0.9,
    directional: "#ffffff",
    directionalIntensity: 1.4,
    rim: "#93c5fd",
    rimIntensity: 0.6,
    bg: "#f8f8f6",
  },
  noir: {
    name: "Moody Noir",
    ambient: "#334155",
    ambientIntensity: 0.4,
    directional: "#f8fafc",
    directionalIntensity: 1.1,
    rim: "#f59e0b",
    rimIntensity: 1.2,
    bg: "#0b0c10",
  },
  sunset: {
    name: "Warm Sunset",
    ambient: "#fed7aa",
    ambientIntensity: 0.8,
    directional: "#ea580c",
    directionalIntensity: 1.5,
    rim: "#fbbf24",
    rimIntensity: 0.8,
    bg: "#faf5ee",
  },
};

/**
 * Error boundary component to catch WebGL context errors gracefully
 */
class WebGLErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            padding: "24px",
            textAlign: "center",
            backgroundColor: "#f6f5f2",
            color: "#374151",
          }}
        >
          <p
            style={{
              fontWeight: 700,
              fontSize: "0.9375rem",
              marginBottom: "6px",
            }}
          >
            Interactive 3D Studio Not Supported
          </p>
          <p style={{ fontSize: "0.8125rem", color: "#6b7280" }}>
            Your browser or device does not have hardware WebGL acceleration
            enabled.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Scene content with camera, lighting rig, model, shadows, and controls
 */
const SceneContent = ({
  product,
  resolvedColor,
  wireframe,
  showHotspots,
  activeHotspot,
  onSelectHotspot,
  autoRotate,
  lightPreset,
  controlsRef,
}) => {
  const lighting = LIGHT_PRESETS[lightPreset] || LIGHT_PRESETS.studio;
  const category = (product?.category || "").toLowerCase();

  // Select the appropriate procedural 3D model based on product category
  const renderModel = () => {
    const commonProps = {
      color: resolvedColor,
      wireframe,
      showHotspots,
      activeHotspot,
      onSelectHotspot,
      autoRotate,
    };

    if (
      category.includes("footwear") ||
      category.includes("sneaker") ||
      category.includes("shoe")
    ) {
      return <Sneaker3DModel {...commonProps} />;
    }
    if (
      category.includes("watch") ||
      category.includes("horology") ||
      category.includes("timepiece")
    ) {
      return <Watch3DModel {...commonProps} />;
    }
    if (
      category.includes("t-shirt") ||
      category.includes("apparel") ||
      category.includes("clothing")
    ) {
      return <Apparel3DModel {...commonProps} />;
    }
    return <GenericProduct3DModel {...commonProps} />;
  };

  return (
    <>
      {/* ── Studio Lighting Rig ── */}
      <ambientLight
        color={lighting.ambient}
        intensity={lighting.ambientIntensity}
      />
      <directionalLight
        position={[5, 8, 5]}
        color={lighting.directional}
        intensity={lighting.directionalIntensity}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      {/* Accent Rim Light */}
      <pointLight
        position={[-5, 3, -5]}
        color={lighting.rim}
        intensity={lighting.rimIntensity}
      />

      {/* ── Procedural 3D Mesh ── */}
      <Suspense fallback={null}>{renderModel()}</Suspense>

      {/* ── Realistic Ground Contact Shadow ── */}
      <ContactShadows
        position={[0, -0.42, 0]}
        opacity={0.65}
        scale={8}
        blur={2}
        far={4}
        color={lightPreset === "noir" ? "#000000" : "#1e293b"}
      />

      {/* ── 360° Orbit & Zoom Controls ── */}
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        minDistance={1.8}
        maxDistance={6.0}
        maxPolarAngle={Math.PI / 2 + 0.08}
        dampingFactor={0.05}
      />
    </>
  );
};

/**
 * Main Product3DCanvas Component
 * Provides complete 3D interactive studio viewing for UrbanCart products.
 */
export const Product3DCanvas = ({
  product,
  activeColor = "",
  height = "480px",
  showControls = true,
  className = "",
}) => {
  const [wireframe, setWireframe] = useState(false);
  const [showHotspots, setShowHotspots] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [lightPreset, setLightPreset] = useState("studio");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const controlsRef = useRef();

  // Resolve active color to hex
  let resolvedColor = "#F5F5F0";
  if (product?.colorways && product.colorways.length > 0) {
    const matched = product.colorways.find(
      (c) => c.name.toLowerCase() === (activeColor || "").toLowerCase(),
    );
    if (matched && matched.hex) {
      resolvedColor = matched.hex;
    } else if (product.colorways[0].hex) {
      resolvedColor = product.colorways[0].hex;
    }
  }

  // Camera Reset Handler
  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
    setActiveHotspot(null);
  };

  const currentLighting = LIGHT_PRESETS[lightPreset] || LIGHT_PRESETS.studio;

  return (
    <WebGLErrorBoundary>
      <div
        className={`product-3d-canvas-wrapper ${className}`}
        style={{
          position: isFullscreen ? "fixed" : "relative",
          top: isFullscreen ? 0 : "auto",
          left: isFullscreen ? 0 : "auto",
          width: isFullscreen ? "100vw" : "100%",
          height: isFullscreen ? "100vh" : height,
          zIndex: isFullscreen ? 99999 : 1,
          borderRadius: isFullscreen ? "0px" : "16px",
          overflow: "hidden",
          backgroundColor: currentLighting.bg,
          border: isFullscreen ? "none" : "1px solid rgba(0, 0, 0, 0.08)",
          boxShadow: isFullscreen ? "none" : "0 6px 24px rgba(0, 0, 0, 0.04)",
          transition: "background-color 0.4s ease",
        }}
      >
        {/* ── Top Bar: Studio Controls ── */}
        {showControls && (
          <div
            style={{
              position: "absolute",
              top: "14px",
              left: "14px",
              right: "14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: 10,
              pointerEvents: "none",
            }}
          >
            {/* Left Badges */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                pointerEvents: "auto",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor:
                    lightPreset === "noir"
                      ? "rgba(255,255,255,0.12)"
                      : "rgba(15, 17, 21, 0.9)",
                  color: "#ffffff",
                  fontSize: "0.6875rem",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "5px 10px",
                  borderRadius: "6px",
                  backdropFilter: "blur(8px)",
                }}
              >
                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    backgroundColor: "#10b981",
                    boxShadow: "0 0 8px #10b981",
                  }}
                />
                3D Studio View
              </span>

              {/* Active Colorway Indicator */}
              <span
                style={{
                  backgroundColor:
                    lightPreset === "noir"
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(255,255,255,0.92)",
                  color: lightPreset === "noir" ? "#e2e8f0" : "#1e293b",
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  padding: "5px 10px",
                  borderRadius: "6px",
                  border: "1px solid rgba(0,0,0,0.08)",
                  backdropFilter: "blur(8px)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: resolvedColor,
                    border: "1px solid rgba(0,0,0,0.2)",
                  }}
                />
                {activeColor || "Original Color"}
              </span>
            </div>

            {/* Right Action Icons */}
            <div
              style={{
                display: "flex",
                gap: "6px",
                alignItems: "center",
                pointerEvents: "auto",
              }}
            >
              {/* Reset Camera */}
              <button
                type="button"
                onClick={handleResetCamera}
                title="Reset Camera View"
                style={{
                  backgroundColor:
                    lightPreset === "noir"
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(255, 255, 255, 0.9)",
                  color: lightPreset === "noir" ? "#ffffff" : "#0f1115",
                  border: "1px solid rgba(0,0,0,0.08)",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  backdropFilter: "blur(8px)",
                }}
              >
                Reset Angle
              </button>

              {/* Fullscreen Toggle */}
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                title={isFullscreen ? "Exit Fullscreen" : "Expand Fullscreen"}
                style={{
                  backgroundColor:
                    lightPreset === "noir"
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(255, 255, 255, 0.9)",
                  color: lightPreset === "noir" ? "#ffffff" : "#0f1115",
                  border: "1px solid rgba(0,0,0,0.08)",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  backdropFilter: "blur(8px)",
                }}
              >
                {isFullscreen ? "✕ Exit" : "⛶ Fullscreen"}
              </button>
            </div>
          </div>
        )}

        {/* ── 3D WebGL Canvas ── */}
        <Canvas
          camera={{ position: [0, 1.2, 3.8], fov: 45 }}
          shadows
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          style={{ width: "100%", height: "100%" }}
        >
          <SceneContent
            product={product}
            resolvedColor={resolvedColor}
            wireframe={wireframe}
            showHotspots={showHotspots}
            activeHotspot={activeHotspot}
            onSelectHotspot={setActiveHotspot}
            autoRotate={autoRotate}
            lightPreset={lightPreset}
            controlsRef={controlsRef}
          />
        </Canvas>

        {/* ── Bottom Floating Inspection Toolbar ── */}
        {showControls && (
          <div
            style={{
              position: "absolute",
              bottom: "14px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "6px",
              alignItems: "center",
              backgroundColor:
                lightPreset === "noir"
                  ? "rgba(23, 25, 32, 0.9)"
                  : "rgba(255, 255, 255, 0.92)",
              border:
                lightPreset === "noir"
                  ? "1px solid rgba(255, 255, 255, 0.15)"
                  : "1px solid rgba(0, 0, 0, 0.08)",
              padding: "6px 12px",
              borderRadius: "9999px",
              boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
              backdropFilter: "blur(12px)",
              zIndex: 10,
              maxWidth: "94%",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {/* Auto-Rotate Switch */}
            <button
              type="button"
              onClick={() => setAutoRotate(!autoRotate)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "5px 10px",
                borderRadius: "9999px",
                fontSize: "0.6875rem",
                fontWeight: 700,
                cursor: "pointer",
                border: "none",
                backgroundColor: autoRotate ? "#0f1115" : "transparent",
                color: autoRotate
                  ? "#ffffff"
                  : lightPreset === "noir"
                    ? "#94a3b8"
                    : "#4b5563",
                transition: "all 0.15s ease",
              }}
            >
              <span>{autoRotate ? "⏸ Pause Spin" : "▶ 360° Spin"}</span>
            </button>

            {/* Wireframe Switch */}
            <button
              type="button"
              onClick={() => setWireframe(!wireframe)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "5px 10px",
                borderRadius: "9999px",
                fontSize: "0.6875rem",
                fontWeight: 700,
                cursor: "pointer",
                border: "none",
                backgroundColor: wireframe ? "#0f1115" : "transparent",
                color: wireframe
                  ? "#ffffff"
                  : lightPreset === "noir"
                    ? "#94a3b8"
                    : "#4b5563",
                transition: "all 0.15s ease",
              }}
            >
              <span>{wireframe ? "Solid" : "Wireframe"}</span>
            </button>

            {/* Feature Hotspots Switch */}
            <button
              type="button"
              onClick={() => {
                setShowHotspots(!showHotspots);
                if (showHotspots) setActiveHotspot(null);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "5px 10px",
                borderRadius: "9999px",
                fontSize: "0.6875rem",
                fontWeight: 700,
                cursor: "pointer",
                border: "none",
                backgroundColor: showHotspots ? "#0f1115" : "transparent",
                color: showHotspots
                  ? "#ffffff"
                  : lightPreset === "noir"
                    ? "#94a3b8"
                    : "#4b5563",
                transition: "all 0.15s ease",
              }}
            >
              <span>Hotspots {showHotspots ? "✓" : "✗"}</span>
            </button>

            {/* Divider */}
            <span
              style={{
                width: "1px",
                height: "14px",
                backgroundColor: lightPreset === "noir" ? "#334155" : "#e2e8f0",
                margin: "0 2px",
              }}
            />

            {/* Lighting Mode Selector */}
            {["studio", "noir", "sunset"].map((presetKey) => (
              <button
                key={presetKey}
                type="button"
                onClick={() => setLightPreset(presetKey)}
                style={{
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "0.625rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "none",
                  backgroundColor:
                    lightPreset === presetKey ? "#0f1115" : "transparent",
                  color:
                    lightPreset === presetKey
                      ? "#ffffff"
                      : lightPreset === "noir"
                        ? "#94a3b8"
                        : "#64748b",
                  transition: "all 0.15s ease",
                }}
              >
                {LIGHT_PRESETS[presetKey].name}
              </button>
            ))}
          </div>
        )}

        {/* Bottom-right Drag Hint */}
        <div
          style={{
            position: "absolute",
            bottom: "14px",
            right: "14px",
            fontSize: "0.625rem",
            color: lightPreset === "noir" ? "#64748b" : "#9ca3af",
            fontWeight: 600,
            pointerEvents: "none",
            display: "none",
          }}
          className="desktop-only-hint"
        >
          Drag to rotate • Scroll to zoom
        </div>
      </div>
    </WebGLErrorBoundary>
  );
};
