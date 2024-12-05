import React from "react";
import { render, screen,prettyDOM } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Home from "./Home";

import "@testing-library/jest-dom";

const mockStore = configureStore([]);
jest.mock('../../Components/PokemonList/PokemonList', () => () => <div data-testid="pokemon-list">Mock PokemonList</div>);
jest.mock('../../Components/Heading/Heading', () => () => <div data-testid="heading">Mock Heading</div>);
jest.mock('../../Components/Tools/Tools', () => () => <div data-testid="tools">Mock Tools</div>);
jest.mock('../../Components/Error/ErrorBoundary', () => ({ children }) => children); // Pass children directly
jest.mock("../../Components/Pagination/Pagination",()=>() => <div data-testid="pagination">Pagination</div>)
jest.mock('./Home.scss', () => ({}));
jest.mock("../../utils/axios");
describe("Home Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      searchedPokemon: { pokemon: null }, // Mock initial state
    });
  });

  it("renders the Home component with its child components", () => {
    const {container} =render(
      <Provider store={store}>
        <Home />
      </Provider>
    );
    console.log(prettyDOM(container))
    // Check if the Heading component is rendered
    expect(screen.getByTestId("heading")).toBeInTheDocument();

    // Check if the Tools component is rendered inside the ErrorBoundary
    expect(screen.getByTestId("tools")).toBeInTheDocument();

    // Check if the PokemonList component is rendered
    expect(screen.getByTestId("pokemon-list")).toBeInTheDocument();

    // Check if Pagination is rendered when searchedPokemon.pokemon is null
    expect(screen.getByTestId("pagination")).toBeInTheDocument();
  });

  it("does not render Pagination when searchedPokemon.pokemon exists", () => {
    store = mockStore({
      searchedPokemon: { pokemon: "Pikachu" }, // Mock updated state
    });

    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );

    // Pagination should not be in the document
    expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
  });

  it("sets body padding based on window width", () => {
    Object.defineProperty(window, "outerWidth", { writable: true, value: 800 });

    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );

    // Check if the padding style is applied
    expect(document.body.style.padding).toBe("43px 75px");

    // Change the window width and rerender
    window.outerWidth = 700;

    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );

    expect(document.body.style.padding).toBe("63px 28px");
  });
});
