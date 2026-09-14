import React from 'react';
import { render, screen } from '@testing-library/react';
import { Product3DCanvas } from './Product3DCanvas';

// Mock Canvas and Drei components since Jest JSDOM doesn't have WebGL / Canvas context
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }) => <div data-testid="r3f-canvas">{children}</div>,
  useFrame: jest.fn(),
  useThree: () => ({ clock: { elapsedTime: 0 } })
}));

jest.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />,
  ContactShadows: () => <div data-testid="contact-shadows" />,
  Float: ({ children }) => <div data-testid="float-wrapper">{children}</div>,
  Html: ({ children }) => <div data-testid="three-html">{children}</div>
}));

describe('Product3DCanvas Component', () => {
  const mockProduct = {
    id: 'uc-fw-086',
    title: 'UrbanCart Mono Low-Top Sneaker',
    category: 'Premium Sneakers',
    colorways: [
      { name: 'Chalk White', hex: '#F5F5F0' },
      { name: 'Obsidian Noir', hex: '#171617' }
    ]
  };

  test('renders 3D studio controls and Canvas wrapper', () => {
    render(<Product3DCanvas product={mockProduct} activeColor="Chalk White" />);
    
    // Checks that the 3D studio header and controls are rendered
    expect(screen.getByText(/3D Studio View/i)).toBeInTheDocument();
    expect(screen.getByText(/Reset Angle/i)).toBeInTheDocument();
    expect(screen.getByText(/Fullscreen/i)).toBeInTheDocument();
    expect(screen.getByText(/Pause Spin/i)).toBeInTheDocument();
    expect(screen.getByText(/Wireframe/i)).toBeInTheDocument();
    expect(screen.getByTestId('r3f-canvas')).toBeInTheDocument();
  });

  test('displays the currently active colorway in badge', () => {
    render(<Product3DCanvas product={mockProduct} activeColor="Obsidian Noir" />);
    expect(screen.getByText('Obsidian Noir')).toBeInTheDocument();
  });
});
