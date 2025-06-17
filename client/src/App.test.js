import { render, screen } from '@testing-library/react';
import App from './App';

test('renders navigation link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Rejestracja/i);
  expect(linkElement).toBeInTheDocument();
});
