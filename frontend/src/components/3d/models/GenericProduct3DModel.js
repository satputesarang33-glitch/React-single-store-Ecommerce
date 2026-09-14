import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';

/**
 * Procedural Luxury Accessories / Capsule 3D Model
 * Modern sculptural pedestal presentation with hovering architectural artifact,
 * dynamic colorway synchronization, and interactive inspection hotspots.
 */
export const GenericProduct3DModel = ({
  color = '#171617',
  wireframe = false,
  showHotspots = true,
  activeHotspot,
  onSelectHotspot,
  autoRotate = false
}) => {
  const groupRef = useRef();
  const floatingRef = useRef();

  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
    if (floatingRef.current) {
      floatingRef.current.position.y = 0.85 + Math.sin(state.clock.elapsedTime * 1.5) * 0.08;
      floatingRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.4, 0]}>
      {/* ── 1. STUDIO DISPLAY PEDESTAL ── */}
      {/* Base Plinth */}
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <cylinderGeometry args={[1.6, 1.7, 0.16, 48]} />
        <meshStandardMaterial color="#e5e5e0" roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Cylindrical Pedestal Column */}
      <mesh position={[0, 0.38, 0]} receiveShadow>
        <cylinderGeometry args={[1.3, 1.3, 0.44, 48]} />
        <meshStandardMaterial color="#f6f5f2" roughness={0.8} metalness={0.05} />
      </mesh>
      {/* Brass Accent Top Ring */}
      <mesh position={[0, 0.61, 0]}>
        <torusGeometry args={[1.31, 0.025, 12, 48]} />
        <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* ── 2. HOVERING CAPSULE ARTIFACT ── */}
      <group ref={floatingRef} position={[0, 0.85, 0]}>
        {/* Core Architectural Box / Capsule */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.2, 1.2, 1.2]} />
          <meshStandardMaterial
            color={color}
            roughness={0.4}
            metalness={0.3}
            wireframe={wireframe}
          />
        </mesh>

        {/* Outer Floating Wireframe Cage Accent */}
        <mesh>
          <boxGeometry args={[1.34, 1.34, 1.34]} />
          <meshStandardMaterial
            color="#d97706"
            wireframe={true}
            transparent={true}
            opacity={0.4}
          />
        </mesh>

        {/* Center Illuminated Emblem Sphere */}
        <mesh>
          <sphereGeometry args={[0.32, 24, 24]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#d97706"
            emissiveIntensity={0.6}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>

        {/* ── 3. INTERACTIVE 3D FEATURE HOTSPOTS ── */}
        {showHotspots && (
          <>
            <group position={[0.7, 0.3, 0.7]}>
              <Html distanceFactor={6} position={[0, 0, 0]} style={{ pointerEvents: 'auto' }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectHotspot?.(activeHotspot === 'materials' ? null : 'materials');
                  }}
                  className="three-hotspot-btn"
                  title="Inspect Craftsmanship"
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: activeHotspot === 'materials' ? '#0f1115' : '#ffffff',
                    color: activeHotspot === 'materials' ? '#ffffff' : '#0f1115',
                    border: '2px solid #0f1115',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 800,
                    transform: 'translate(-50%, -50%)',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  1
                </button>
                {activeHotspot === 'materials' && (
                  <div style={{
                    position: 'absolute',
                    left: '28px',
                    top: '-20px',
                    backgroundColor: '#0f1115',
                    color: '#ffffff',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                    minWidth: '170px',
                    fontSize: '11px',
                    lineHeight: '1.4',
                    zIndex: 20
                  }}>
                    <strong style={{ display: 'block', color: '#f59e0b', fontSize: '11px', marginBottom: '2px' }}>
                      Atelier Certified Build
                    </strong>
                    Precision-engineered aerospace finishes and sustainable structural composites.
                  </div>
                )}
              </Html>
            </group>
          </>
        )}
      </group>
    </group>
  );
};
