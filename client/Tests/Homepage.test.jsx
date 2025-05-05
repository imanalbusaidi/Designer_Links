import React from "react";
import { render, screen } from "@testing-library/react";
import Homepage from "../src/Components/Homepage";

describe("Homepage", () => {
  it("renders DesignerLink title", () => {
    render(<Homepage />);
    // Get all headings with name matching /DesignerLink/i
    const headings = screen.getAllByRole("heading", { name: /DesignerLink/i });
    expect(headings.length).toBeGreaterThan(0);
    // Optionally, check the first heading is h1
    expect(headings[0].tagName).toBe("H1");
  });
});