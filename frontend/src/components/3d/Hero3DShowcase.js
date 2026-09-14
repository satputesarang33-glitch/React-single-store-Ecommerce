import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, OrbitControls, ContactShadows } from '@react-three/drei';
import { Sneaker3DModel } from './models/Sneaker3DModel';
import { Watch3DModel } from './models/Watch3DModel';

/**
 * Hero3DShowcase Component
 * Floating, cursor-reactive 3D luxury showcase designed for the Storefront Hero banner.
 */
export const Hero3DShowcase = ({ onExploreProduct }) => {
  const [activeItem, setActiveItem] = useState('sneaker'); // 'sneaker' | 'watch'
  const [activeColor, setActiveColor] = useState('#F5F5F0');

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '520px',
        borderRadius: '20px',
        overflow: 'hidden',
        backgroundColor: '#f8f8f6',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.08)'
      }}
    >
      {/* ── Top Floating Switcher ── */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          right: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
          pointerEvents: 'none'
        }}
      >
        <div style={{ display: 'flex', gap: '8px', pointerEvents: 'auto' }}>
          <button
            type="button"
            onClick={() => {
              setActiveItem('sneaker');
              setActiveColor('#F5F5F0');
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              backgroundColor: activeItem === 'sneaker' ? '#0f1115' : 'rgba(255, 255, 255, 0.9)',
              color: activeItem === 'sneaker' ? '#ffffff' : '#4b5563',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s ease'
            }}
          >
            👟 Mono Sneaker 3D
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveItem('watch');
              setActiveColor('#262930');
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              backgroundColor: activeItem === 'watch' ? '#0f1115' : 'rgba(255, 255, 255, 0.9)',
              color: activeItem === 'watch' ? '#ffffff' : '#4b5563',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s ease'
            }}
          >
            ⌚ Pulse Watch 3D
          </button>
        </div>

        {/* Live 3D Badge */}
        <span
          style={{
            backgroundColor: '#10b981',
            color: '#ffffff',
            fontSize: '0.625rem',
            fontWeight: 800,
            letterSpacing: '0.1em',
            padding: '4px 10px',
            borderRadius: '9999px',
            textTransform: 'uppercase',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)'
          }}
        >
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#ffffff' }} />
          Interactive 3D
        </span>
      </div>

      {/* ── WebGL Canvas with Floating Geometry ── */}
      <Canvas
        camera={{ position: [0, 0.8, 3.6], fov: 45 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
        <pointLight position={[-5, 3, -5]} color="#93c5fd" intensity={0.8} />

        <Suspense fallback={null}>
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.6}>
            {activeItem === 'sneaker' ? (
              <Sneaker3DModel color={activeColor} showHotspots={false} autoRotate={true} />
            ) : (
              <Watch3DModel color={activeColor} showHotspots={false} autoRotate={true} />
            )}
          </Float>
        </Suspense>

        <ContactShadows
          position={[0, -0.9, 0]}
          opacity={0.5}
          scale={7}
          blur={2.5}
          far={4}
          color="#0f172a"
        />

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2 + 0.1}
          dampingFactor={0.05}
        />
      </Canvas>

      {/* ── Bottom Callout Bar ── */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          right: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          padding: '10px 16px',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          zIndex: 10
        }}
      >
        <div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#0f1115' }}>
            {activeItem === 'sneaker' ? 'UrbanCart Mono Low-Top' : 'Pulse Active Smart Watch'}
          </div>
          <div style={{ fontSize: '0.6875rem', color: '#6b7280' }}>
            {activeItem === 'sneaker' ? 'Tuscan Full-Grain Calfskin • Margom Cupsole' : 'Sapphire Retina Display • Series 6000 Aluminum'}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onExploreProduct?.(activeItem === 'sneaker' ? 'uc-fw-086' : 'uc-sw-101')}
          style={{
            backgroundColor: '#0f1115',
            color: '#ffffff',
            border: 'none',
            padding: '7px 16px',
            borderRadius: '8px',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
          }}
        >
          View in 3D Studio →
        </button>
      </div>
    </div>
  );
};
