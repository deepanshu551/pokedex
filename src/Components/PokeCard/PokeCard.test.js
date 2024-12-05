import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  prettyDOM,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import PokeCard from "./PokeCard";
import fetchMock from "jest-fetch-mock";

import { selectPokemon } from "../../store/slices/selectedPokemonSlice";
jest.mock("./PokeCard.scss", () => ({}));
fetchMock.enableMocks();
jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

jest.mock("../../styles/typeColor.scss", () => ({
  fire: "red",
  water: "blue",
}));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));
describe("PokeCard Component", () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();

  const mockPokemon = {
    name: "charmander",
    url: "https://pokeapi.co/api/v2/pokemon/4/",
    sprites: {
      other: {
        dream_world: {
          front_default: "charmander.png",
        },
      },
    },
    id: 4,
    types: [{ type: { name: "fire" } }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
    jest
      .spyOn(require("react-router-dom"), "useNavigate")
      .mockReturnValue(mockNavigate);
  });

  it("renders the component with Pokémon data", () => {
    render(
      <Router>
        <PokeCard pokemon={mockPokemon} />
      </Router>
    );

    expect(screen.getByText("charmander")).toBeInTheDocument();
    expect(screen.getByText("004")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", "charmander.png");
  });

  it("dispatches action and navigates on card click", () => {
    render(
      <Router>
        <PokeCard pokemon={mockPokemon} />
      </Router>
    );

    fireEvent.click(screen.getByText("charmander"));

    expect(mockDispatch).toHaveBeenCalledWith(selectPokemon(mockPokemon));
    expect(mockNavigate).toHaveBeenCalledWith("/details");
  });

  it("fetches Pokémon details when not cached", async () => {
    const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        id: 5,
        sprites: {
          other: {
            dream_world: {
              front_default: "bulbasaur.png",
            },
          },
        },
        types: [{ type: { name: "water" } }],
      }),
    });

    const mockPokemonNoSprites = {
      name: "bulbasaur",
      url: "https://pokeapi.co/api/v2/pokemon/5/",
    };

    render(
      <Router>
        <PokeCard pokemon={mockPokemonNoSprites} />
      </Router>
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "https://pokeapi.co/api/v2/pokemon/5/"
      );
      expect(screen.getByRole("img")).toHaveAttribute("src", "bulbasaur.png");
    });

    fetchMock.mockRestore();
  });

  it("applies correct background style for Pokémon types", () => {
    render(
      <Router>
        <PokeCard pokemon={mockPokemon} />
      </Router>
    );

    const card = screen.getByText("charmander").closest(".poke-card-container");
    expect(card).toHaveStyle("background: red");
  });
});
