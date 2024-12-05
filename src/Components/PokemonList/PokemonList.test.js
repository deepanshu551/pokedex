import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { useDispatch, useSelector } from "react-redux";
import PokemonList from "./PokemonList";
import "@testing-library/jest-dom";
import PokeCard from "../PokeCard/PokeCard";
import axios from "../../utils/axios";
import { setPokemons } from "../../store/slices/pokemonSlice";
import { setGenderList } from "../../store/slices/genderSlice";

// Mocking dependencies
jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
  }));

jest.mock("../../utils/axios", () => ({
    __esModule: true, 
    default: {
      get: jest.fn(),
      post: jest.fn(),
    },
  }));
jest.mock("../PokeCard/PokeCard", () => jest.fn(() => <div data-testid="poke-card"></div>));
jest.mock('./PokemonList.scss', () => ({}));

const mockStore = configureStore([]);

describe("PokemonList Component", () => {
  let storeData;
  let dispatchMock;

  beforeEach(() => {
    storeData = mockStore({
      searchedPokemon: { pokemon: null },
      pokemon: { pokemons: null },
    });
    dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);
    useSelector.mockImplementation((selector) =>
      selector({
        searchedPokemon: { pokemon: null },
        pokemon: { pokemons: null },
      })
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders the PokemonList component", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        results: [{ name: "bulbasaur", url: "/pokemon/1/" }],
      },
    });

    render(
      <Provider store={storeData}>
        <PokemonList />
      </Provider>
    );
 
   
      expect(screen.getAllByTestId("poke-card").length).toBeGreaterThan(0);
   
  });
});
