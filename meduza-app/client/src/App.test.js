import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders navigation link", () => {
  render(<App />);
  const links = screen.getAllByText(/Rejestracja/i);
  expect(links.length).toBeGreaterThan(0);
});
