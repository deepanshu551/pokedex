import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import configureStore from "redux-mock-store";
import Pagination from "./Pagination";
import { setPokemons } from "../../store/slices/pokemonSlice";
import { setNextSet, setPrevSet } from "../../store/slices/filteredPokemon";
const mockStore = configureStore([]);
jest.mock("./Pagination.scss", () => ({}));

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

describe("Pagination Component", () => {
  let storeData, mockDispatch;

  beforeEach(() => {
    storeData = mockStore({
      pokemon: {
        pokemons: { next: "/nextPage", previous: "/prevPage", results: [] },
      },
      filteredList: { pokemons: [], nextSet: 0, prevSet: 0 },
    });

    mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((callback) =>
      callback({
        pokemon: {
          pokemons: { next: "/nextPage", previous: "/prevPage", results: [] },
        },
        filteredList: { pokemons: [], nextSet: 0, prevSet: 0 },
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it("renders Pagination component with previous and next buttons", () => {
    render(
      <Provider store={storeData}>
        <Pagination />
      </Provider>
    );

    expect(screen.getByText("previous")).toBeInTheDocument();
    expect(screen.getByText("next")).toBeInTheDocument();
  });

  test("disables 'previous' button if no previous page", async () => {
    render(
      <Provider store={storeData}>
        <Pagination />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("previous")).toBeDisabled();
    });
  });

  test("calls the next function and dispatches actions", async () => {
    render(
      <Provider store={storeData}>
        <Pagination />
      </Provider>
    );

    const nextButton = screen.getByTestId("next");

    // Mock the fetch response for the next page
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: jest
        .fn()
        .mockResolvedValue({ next: null, previous: "/prevPage", results: [] }),
    });

    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(setPokemons({ results: [] }));
      expect(mockDispatch).toHaveBeenCalledWith(setNextSet(20));
      expect(mockDispatch).toHaveBeenCalledWith(setPrevSet(0));
    });
  });
});
