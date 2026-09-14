import React from 'react';
import '@testing-library/jest-dom';

// Safe default mock for react-router-dom in unit tests
const mockNavigate = jest.fn();
const mockLocation = Object.freeze({ pathname: '/', search: '', hash: '', state: null });
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div data-testid="browser-router">{children}</div>,
  MemoryRouter: ({ children }) => <div data-testid="memory-router">{children}</div>,
  Routes: ({ children }) => <div data-testid="routes">{children}</div>,
  Route: ({ element }) => element || null,
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
  NavLink: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
  Navigate: ({ to }) => <div data-testid="navigate-mock" data-to={to} />,
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
  useParams: () => ({ id: 'uc-fw-086' }),
  useSearchParams: () => [new URLSearchParams(), jest.fn()]
}));

