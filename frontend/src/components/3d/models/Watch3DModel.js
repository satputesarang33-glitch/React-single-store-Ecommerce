import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';

/**
 * Procedural Luxury Smart Watch / Timepiece 3D Model
 * High-precision watch geometry with aerospace metal bezel, sapphire crystal lens,
 * dynamic colorway synchronization, and interactive inspection hotspots.
 */
export const Watch3DModel = ({
  color = '#262930',
  wireframe = false,
  showHotspots = true,
  activeHotspot,
  onSelectHotspot,
  autoRotate = false
}) => {
  const groupRef = useRef();
  const handsRef = useRef();

  // Subtle continuous rotation and animated watch second-tick
  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
    if (handsRef.current) {
      handsRef.current.rotation.z = -state.clock.elapsedTime * 0.5;
    }
  });

  const isSilver = color.toLowerCase().includes('cbd5e1') || color.toLowerCase().includes('silver') || color.toLowerCase().includes('white');
  const caseMetalColor = isSilver ? '#e2e8f0' : '#1e2128';
  const strapColor = isSilver ? '#475569' : '#18191f';

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0.4, -0.3, 0]}>
      {/* ── 1. MAIN WATCH CASE BODY (Cylinder) ── */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.35, 1.35, 0.38, 48]} />
        <meshStandardMaterial
          color={caseMetalColor}
          metalness={0.88}
          roughness={0.24}
          wireframe={wireframe}
        />
      </mesh>

      {/* Outer Polished Chamfer Bezel Ring */}
      <mesh position={[0, 0.2, 0]}>
        <torusGeometry args={[1.34, 0.05, 16, 64]} />
        <meshStandardMaterial
          color={isSilver ? '#ffffff' : '#475569'}
          metalness={0.95}
          roughness={0.15}
          wireframe={wireframe}
        />
      </mesh>

      {/* ── 2. SAPPHIRE CRYSTAL GLASS & DIAL SCREEN ── */}
      {/* Black AMOLED Dial Face */}
      <mesh position={[0, 0.205, 0]}>
        <cylinderGeometry args={[1.25, 1.25, 0.02, 48]} />
        <meshStandardMaterial
          color="#090a0f"
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Outer Dial Dial Markers Ring */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * Math.PI) / 6;
        const x = Math.sin(angle) * 1.05;
        const z = Math.cos(angle) * 1.05;
        return (
          <mesh key={i} position={[x, 0.22, z]} rotation={[0, -angle, 0]}>
            <boxGeometry args={[0.04, 0.01, 0.14]} />
            <meshStandardMaterial color={isSilver ? '#38bdf8' : '#f59e0b'} emissive={isSilver ? '#38bdf8' : '#f59e0b'} emissiveIntensity={0.6} />
          </mesh>
        );
      })}

      {/* Watch Hands Center Hub */}
      <mesh position={[0, 0.23, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Rotating Watch Second Hand */}
      <group ref={handsRef} position={[0, 0.235, 0]}>
        <mesh position={[0, 0, 0.45]} rotation={[-Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.02, 0.75, 0.01]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* Static Hour Hand */}
      <mesh position={[0.2, 0.23, 0.2]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[0.05, 0.015, 0.5]} />
        <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Translucent Sapphire Crystal Shield */}
      <mesh position={[0, 0.24, 0]}>
        <cylinderGeometry args={[1.28, 1.28, 0.03, 32]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.35}
          roughness={0.05}
          transmission={0.8}
          thickness={0.5}
          ior={1.77}
        />
      </mesh>

      {/* ── 3. DIGITAL CROWN BUTTON & SENSOR DIAL ── */}
      <mesh position={[1.42, 0.05, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.22, 24]} />
        <meshStandardMaterial
          color={caseMetalColor}
          metalness={0.95}
          roughness={0.3}
          wireframe={wireframe}
        />
      </mesh>
      {/* Crown Accent Ring */}
      <mesh position={[1.54, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.17, 0.02, 8, 24]} />
        <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* ── 4. STRAP (Curved Top & Bottom Bands) ── */}
      {/* Top Strap */}
      <mesh position={[0, -0.05, -2.1]} rotation={[-0.25, 0, 0]} castShadow>
        <boxGeometry args={[1.05, 0.16, 1.9]} />
        <meshStandardMaterial
          color={strapColor}
          roughness={0.75}
          metalness={0.1}
          wireframe={wireframe}
        />
      </mesh>
      {/* Top Clasp / Buckle */}
      <mesh position={[0, 0.02, -3.1]} rotation={[-0.25, 0, 0]}>
        <boxGeometry args={[1.15, 0.22, 0.3]} />
        <meshStandardMaterial
          color={caseMetalColor}
          metalness={0.9}
          roughness={0.25}
        />
      </mesh>

      {/* Bottom Strap */}
      <mesh position={[0, -0.05, 2.1]} rotation={[0.25, 0, 0]} castShadow>
        <boxGeometry args={[1.05, 0.16, 1.9]} />
        <meshStandardMaterial
          color={strapColor}
          roughness={0.75}
          metalness={0.1}
          wireframe={wireframe}
        />
      </mesh>

      {/* ── 5. INTERACTIVE 3D FEATURE HOTSPOTS ── */}
      {showHotspots && (
        <>
          {/* Hotspot 1: Sapphire Display */}
          <group position={[0, 0.35, 0]}>
            <Html distanceFactor={6} position={[0, 0, 0]} style={{ pointerEvents: 'auto' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectHotspot?.(activeHotspot === 'screen' ? null : 'screen');
                }}
                className="three-hotspot-btn"
                title="Inspect Sapphire AMOLED Screen"
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: activeHotspot === 'screen' ? '#0f1115' : '#ffffff',
                  color: activeHotspot === 'screen' ? '#ffffff' : '#0f1115',
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
              {activeHotspot === 'screen' && (
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
                    Sapphire AMOLED Retina
                  </strong>
                  Always-On 1,000 nit edge-to-edge display protected by Mohs 9 scratch-resistant sapphire.
                </div>
              )}
            </Html>
          </group>

          {/* Hotspot 2: Aerospace Aluminum Case */}
          <group position={[1.4, 0.1, 0.3]}>
            <Html distanceFactor={6} position={[0, 0, 0]} style={{ pointerEvents: 'auto' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectHotspot?.(activeHotspot === 'chassis' ? null : 'chassis');
                }}
                className="three-hotspot-btn"
                title="Inspect Aerospace Aluminum"
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: activeHotspot === 'chassis' ? '#0f1115' : '#ffffff',
                  color: activeHotspot === 'chassis' ? '#ffffff' : '#0f1115',
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
                2
              </button>
              {activeHotspot === 'chassis' && (
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
                    Series 6000 Aluminum
                  </strong>
                  CNC-milled unibody chassis engineered for 5 ATM water resistance (50m depth).
                </div>
              )}
            </Html>
          </group>

          {/* Hotspot 3: Fluoroelastomer Strap */}
          <group position={[0, -0.05, 1.9]}>
            <Html distanceFactor={6} position={[0, 0, 0]} style={{ pointerEvents: 'auto' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectHotspot?.(activeHotspot === 'strap' ? null : 'strap');
                }}
                className="three-hotspot-btn"
                title="Inspect Sport Strap"
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: activeHotspot === 'strap' ? '#0f1115' : '#ffffff',
                  color: activeHotspot === 'strap' ? '#ffffff' : '#0f1115',
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
                3
              </button>
              {activeHotspot === 'strap' && (
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
                    Fluoroelastomer Sport Band
                  </strong>
                  High-performance soft-touch polymer with micro-ventilation channels and pin-and-tuck closure.
                </div>
              )}
            </Html>
          </group>
        </>
      )}
    </group>
  );
};
