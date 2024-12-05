import React from "react";
import { render, screen } from "@testing-library/react";
import Heading from "./Heading"; 
import "@testing-library/jest-dom";


jest.mock("./Heading.scss", () => ({}));

describe("Heading Component", () => {
  test("renders the heading component", () => {
    const {container} =render(
    <Heading />
);


    const headingTitle = screen.getByRole("heading", { name: /pokédex/i });
    const descriptionText = screen.getByText(/Search of any Pokémon that exists on the planet/i);
    const dividerElement = screen.getByTestId("divider");

    expect(headingTitle).toBeInTheDocument();
    expect(descriptionText).toBeInTheDocument();
    expect(dividerElement).toBeInTheDocument();
  });

  test("has correct class for heading title", () => {
    render(<Heading />);
    
    const headingTitle = screen.getByRole("heading", { name: /pokédex/i });
    
    expect(headingTitle).toHaveClass("heading_bolder");
  });

  test("has correct class for description text", () => {
    render(<Heading />);
    
    const descriptionText = screen.getByText(/Search of any Pokémon that exists on the planet/i);
    
    expect(descriptionText).toHaveClass("heading_bold");
  });

  test("renders the divider", () => {
    render(<Heading />);
    
    const dividerElement = screen.getByTestId("divider");
    
    expect(dividerElement).toBeInTheDocument();
  });
});
