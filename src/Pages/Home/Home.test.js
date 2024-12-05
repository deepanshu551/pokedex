import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Home from "./Home";

import "@testing-library/jest-dom";

const mockStore = configureStore([]);
jest.mock("../../Components/PokemonList/PokemonList", () => () => (
  <div data-testid="pokemon-list">Mock PokemonList</div>
));
jest.mock("../../Components/Heading/Heading", () => () => (
  <div data-testid="heading">Mock Heading</div>
));
jest.mock("../../Components/Tools/Tools", () => () => (
  <div data-testid="tools">Mock Tools</div>
));
jest.mock(
  "../../Components/Error/ErrorBoundary",
  () =>
    ({ children }) =>
      children
); // Pass children directly
jest.mock("../../Components/Pagination/Pagination", () => () => (
  <div data-testid="pagination">Pagination</div>
));
jest.mock("./Home.scss", () => ({}));
jest.mock("../../utils/axios");
describe("Home Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      searchedPokemon: { pokemon: null }, // Mock initial state
    });
  });

  it("renders the Home component with its child components", () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );

    expect(screen.getByTestId("heading")).toBeInTheDocument();

    expect(screen.getByTestId("tools")).toBeInTheDocument();

    expect(screen.getByTestId("pokemon-list")).toBeInTheDocument();

    expect(screen.getByTestId("pagination")).toBeInTheDocument();
  });

  it("does not render Pagination when searchedPokemon.pokemon exists", () => {
    store = mockStore({
      searchedPokemon: { pokemon: "Pikachu" },
    });

    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );

    expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
  });

  it("sets body padding based on window width", () => {
    Object.defineProperty(window, "outerWidth", { writable: true, value: 800 });

    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );

    expect(document.body.style.padding).toBe("43px 75px");

    window.outerWidth = 700;

    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );

    expect(document.body.style.padding).toBe("63px 28px");
  });
});
