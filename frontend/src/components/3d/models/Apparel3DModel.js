import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';

/**
 * Procedural Luxury Apparel / T-Shirt 3D Model
 * Minimalist studio presentation with hanger, draped fabric folds,
 * dynamic colorway synchronization, and interactive inspection hotspots.
 */
export const Apparel3DModel = ({
  color = '#D7C7B0',
  wireframe = false,
  showHotspots = true,
  activeHotspot,
  onSelectHotspot,
  autoRotate = false
}) => {
  const groupRef = useRef();

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]} rotation={[0, -0.2, 0]}>
      {/* ── 1. STUDIO DISPLAY HANGER ── */}
      {/* Wooden Hanger Bar */}
      <mesh position={[0, 1.45, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 2.2, 16]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#854d0e" roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Hanger Metal Hook */}
      <mesh position={[0, 1.68, 0]}>
        <torusGeometry args={[0.16, 0.02, 8, 24, Math.PI * 1.3]} rotation={[0, 0, -0.4]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* ── 2. T-SHIRT TORSO BODY ── */}
      {/* Main Chest/Torso */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.7, 1.7, 0.42]} />
        <meshStandardMaterial
          color={color}
          roughness={0.88}
          metalness={0.03}
          wireframe={wireframe}
        />
      </mesh>

      {/* T-Shirt Hem (Bottom Border) */}
      <mesh position={[0, -0.38, 0]} castShadow>
        <boxGeometry args={[1.72, 0.08, 0.44]} />
        <meshStandardMaterial
          color={color}
          roughness={0.92}
          metalness={0.02}
          wireframe={wireframe}
        />
      </mesh>

      {/* ── 3. SHOULDERS & CREW COLLAR ── */}
      {/* Shoulder Slopes */}
      <mesh position={[-0.55, 1.3, 0]} rotation={[0, 0, 0.2]} castShadow>
        <boxGeometry args={[0.7, 0.22, 0.4]} />
        <meshStandardMaterial color={color} roughness={0.88} metalness={0.03} wireframe={wireframe} />
      </mesh>
      <mesh position={[0.55, 1.3, 0]} rotation={[0, 0, -0.2]} castShadow>
        <boxGeometry args={[0.7, 0.22, 0.4]} />
        <meshStandardMaterial color={color} roughness={0.88} metalness={0.03} wireframe={wireframe} />
      </mesh>

      {/* Ribbed Crewneck Collar */}
      <mesh position={[0, 1.35, 0]}>
        <torusGeometry args={[0.32, 0.05, 16, 32]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial
          color={color}
          roughness={0.95}
          metalness={0.01}
          wireframe={wireframe}
        />
      </mesh>

      {/* ── 4. SHORT SLEEVES ── */}
      {/* Left Sleeve */}
      <mesh position={[-1.02, 1.05, 0]} rotation={[0, 0, 0.5]} castShadow>
        <cylinderGeometry args={[0.26, 0.32, 0.7, 16]} />
        <meshStandardMaterial color={color} roughness={0.88} metalness={0.03} wireframe={wireframe} />
      </mesh>
      {/* Right Sleeve */}
      <mesh position={[1.02, 1.05, 0]} rotation={[0, 0, -0.5]} castShadow>
        <cylinderGeometry args={[0.26, 0.32, 0.7, 16]} />
        <meshStandardMaterial color={color} roughness={0.88} metalness={0.03} wireframe={wireframe} />
      </mesh>

      {/* ── 5. INTERACTIVE 3D FEATURE HOTSPOTS ── */}
      {showHotspots && (
        <>
          {/* Hotspot 1: Bound Collar */}
          <group position={[0, 1.45, 0.25]}>
            <Html distanceFactor={6} position={[0, 0, 0]} style={{ pointerEvents: 'auto' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectHotspot?.(activeHotspot === 'collar' ? null : 'collar');
                }}
                className="three-hotspot-btn"
                title="Inspect Ribbed Collar"
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: activeHotspot === 'collar' ? '#0f1115' : '#ffffff',
                  color: activeHotspot === 'collar' ? '#ffffff' : '#0f1115',
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
              {activeHotspot === 'collar' && (
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
                    1x1 Bound Rib Collar
                  </strong>
                  Reinforced neckline engineered to retain structural memory without baconing over 100+ wash cycles.
                </div>
              )}
            </Html>
          </group>

          {/* Hotspot 2: Peruvian Pima Cotton */}
          <group position={[0.4, 0.5, 0.26]}>
            <Html distanceFactor={6} position={[0, 0, 0]} style={{ pointerEvents: 'auto' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectHotspot?.(activeHotspot === 'fabric' ? null : 'fabric');
                }}
                className="three-hotspot-btn"
                title="Inspect Pima Fabric"
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: activeHotspot === 'fabric' ? '#0f1115' : '#ffffff',
                  color: activeHotspot === 'fabric' ? '#ffffff' : '#0f1115',
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
              {activeHotspot === 'fabric' && (
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
                    310 GSM Combed Pima
                  </strong>
                  Milled in Lima, Peru using long-staple organic fibers for heavy drape and featherlight skin feel.
                </div>
              )}
            </Html>
          </group>
        </>
      )}
    </group>
  );
};
