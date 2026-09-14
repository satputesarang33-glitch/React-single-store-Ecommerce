import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';

/**
 * Procedural Luxury Sneaker 3D Model
 * Renders a handcrafted low-top sneaker geometry with realistic PBR materials,
 * dynamic colorway synchronization, wireframe mode, and interactive hotspots.
 */
export const Sneaker3DModel = ({
  color = '#F5F5F0',
  wireframe = false,
  showHotspots = true,
  activeHotspot,
  onSelectHotspot,
  autoRotate = false
}) => {
  const groupRef = useRef();

  // Subtle continuous rotation if enabled
  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  // Calculate sole and accent color based on upper color
  const isDarkUpper =
    color.toLowerCase().includes('171617') ||
    color.toLowerCase().includes('black') ||
    color.toLowerCase() === '#1c1d21' ||
    color.toLowerCase() === '#222326';
  const soleColor = isDarkUpper ? '#24252a' : '#f0ede6';
  const accentColor = isDarkUpper ? '#3f424e' : '#ded9d0';

  return (
    <group ref={groupRef} position={[0, -0.4, 0]} rotation={[0.05, -0.4, 0]}>
      {/* ── 1. SOLE (Midsole + Outsole Margom Cupsole) ── */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.35, 3.4]} />
        <meshStandardMaterial
          color={soleColor}
          roughness={0.82}
          metalness={0.05}
          wireframe={wireframe}
        />
      </mesh>

      {/* Outsole Grip Edge Base */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[1.56, 0.08, 3.46]} />
        <meshStandardMaterial
          color={isDarkUpper ? '#151618' : '#e2ded5'}
          roughness={0.95}
          metalness={0.02}
          wireframe={wireframe}
        />
      </mesh>

      {/* ── 2. UPPER BODY (Vamp & Main Leather Footbed) ── */}
      <mesh position={[0, 0.58, 0.1]} castShadow>
        <boxGeometry args={[1.44, 0.48, 3.2]} />
        <meshStandardMaterial
          color={color}
          roughness={0.62}
          metalness={0.08}
          wireframe={wireframe}
        />
      </mesh>

      {/* Toe Box Curve Profile */}
      <mesh position={[0, 0.5, 1.25]} rotation={[0.25, 0, 0]} castShadow>
        <boxGeometry args={[1.4, 0.38, 0.9]} />
        <meshStandardMaterial
          color={color}
          roughness={0.65}
          metalness={0.08}
          wireframe={wireframe}
        />
      </mesh>

      {/* Front Toe Cap Guard */}
      <mesh position={[0, 0.45, 1.58]} castShadow>
        <cylinderGeometry args={[0.68, 0.72, 0.32, 24, 1, false, 0, Math.PI]} />
        <meshStandardMaterial
          color={accentColor}
          roughness={0.7}
          metalness={0.05}
          wireframe={wireframe}
        />
      </mesh>

      {/* ── 3. HEEL & COLLAR (Anatomic Padded Collar) ── */}
      <mesh position={[0, 0.95, -0.95]} castShadow>
        <boxGeometry args={[1.36, 0.65, 1.15]} />
        <meshStandardMaterial
          color={color}
          roughness={0.65}
          metalness={0.08}
          wireframe={wireframe}
        />
      </mesh>

      {/* Heel Counter Reinforcement Tab */}
      <mesh position={[0, 0.78, -1.55]} castShadow>
        <boxGeometry args={[1.38, 0.8, 0.12]} />
        <meshStandardMaterial
          color={accentColor}
          roughness={0.55}
          metalness={0.12}
          wireframe={wireframe}
        />
      </mesh>

      {/* ── 4. TONGUE & INTERIOR LINING ── */}
      <mesh position={[0, 1.05, -0.1]} rotation={[-0.32, 0, 0]} castShadow>
        <boxGeometry args={[0.92, 0.15, 1.5]} />
        <meshStandardMaterial
          color={color}
          roughness={0.6}
          metalness={0.08}
          wireframe={wireframe}
        />
      </mesh>

      {/* Tongue Logo Brand Badge */}
      <mesh position={[0, 1.24, -0.38]} rotation={[-0.32, 0, 0]}>
        <boxGeometry args={[0.45, 0.04, 0.3]} />
        <meshStandardMaterial
          color="#0f1115"
          roughness={0.3}
          metalness={0.6}
          wireframe={wireframe}
        />
      </mesh>

      {/* ── 5. LACES & EYELETS ── */}
      {[-0.15, 0.18, 0.52, 0.84].map((zPos, idx) => (
        <group key={idx} position={[0, 0.82 - idx * 0.06, zPos]}>
          {/* Lace Cross-Bar */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.035, 0.035, 0.88, 12]} />
            <meshStandardMaterial
              color="#ffffff"
              roughness={0.9}
              wireframe={wireframe}
            />
          </mesh>
          {/* Left Eyelet */}
          <mesh position={[-0.46, 0, 0]}>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Right Eyelet */}
          <mesh position={[0.46, 0, 0]}>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* ── 6. INTERACTIVE 3D FEATURE HOTSPOTS ── */}
      {showHotspots && (
        <>
          {/* Hotspot 1: Calfskin Upper */}
          <group position={[0.78, 0.72, 0.2]}>
            <Html distanceFactor={7} position={[0, 0, 0]} style={{ pointerEvents: 'auto' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectHotspot?.(activeHotspot === 'upper' ? null : 'upper');
                }}
                className="three-hotspot-btn"
                title="Inspect Calfskin Upper"
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: activeHotspot === 'upper' ? '#0f1115' : '#ffffff',
                  color: activeHotspot === 'upper' ? '#ffffff' : '#0f1115',
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
              {activeHotspot === 'upper' && (
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
                    Tuscan Full-Grain Calfskin
                  </strong>
                  LWG Gold Certified hand-burnished Italian leather with natural moisture resistance.
                </div>
              )}
            </Html>
          </group>

          {/* Hotspot 2: Margom Rubber Sole */}
          <group position={[-0.82, 0.2, 0.8]}>
            <Html distanceFactor={7} position={[0, 0, 0]} style={{ pointerEvents: 'auto' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectHotspot?.(activeHotspot === 'sole' ? null : 'sole');
                }}
                className="three-hotspot-btn"
                title="Inspect Margom Sole"
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: activeHotspot === 'sole' ? '#0f1115' : '#ffffff',
                  color: activeHotspot === 'sole' ? '#ffffff' : '#0f1115',
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
              {activeHotspot === 'sole' && (
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
                    Margom Vulcanized Outsole
                  </strong>
                  Italian Margom rubber with 360° sidewall lock-stitching for multi-year durability.
                </div>
              )}
            </Html>
          </group>

          {/* Hotspot 3: Anatomic Heel Collar */}
          <group position={[0, 1.3, -1.2]}>
            <Html distanceFactor={7} position={[0, 0, 0]} style={{ pointerEvents: 'auto' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectHotspot?.(activeHotspot === 'heel' ? null : 'heel');
                }}
                className="three-hotspot-btn"
                title="Inspect Anatomic Heel"
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: activeHotspot === 'heel' ? '#0f1115' : '#ffffff',
                  color: activeHotspot === 'heel' ? '#ffffff' : '#0f1115',
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
              {activeHotspot === 'heel' && (
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
                    Ergonomic Memory Foam
                  </strong>
                  Molded heel collar lined with antimicrobial micro-suede for zero break-in friction.
                </div>
              )}
            </Html>
          </group>
        </>
      )}
    </group>
  );
};
