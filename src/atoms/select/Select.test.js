import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  prettyDOM,
} from "@testing-library/react";
import Select from "./Select";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import RangeSlider from "../RangeSlider/RangeSlider";
import Loading from "../Loading/Loading";
import "@testing-library/jest-dom";
import axios from "../../utils/axios";

jest.mock("./Select.scss", () => ({}));

jest.mock("../../utils/axios", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

jest.mock("../RangeSlider/RangeSlider", () => () => (
  <input
    type="range"
    min="0"
    max="210"
    value={70}
    data-testid={`slider-1-HP`}
    id={`slider-1-HP`}
  />
));
jest.mock("../Loading/Loading", () => () => (
  <div data-testid="loading">Loading</div>
));
const mockStore = configureStore([]);

describe("Select Component", () => {
  let store;
  const mockSelectedPokemon = {
    pokemon: {
      id: 1,
      name: "bulbasaur",
      height: 7,
      abilities: [{ ability: { name: "overgrow" } }],
      types: [{ type: { name: "grass" } }],
      stats: [
        {
          base_stat: 60,
          effort: 0,
          stat: {
            name: "hp",
            url: "https://pokeapi.co/api/v2/stat/1/",
          },
        },
        {
          base_stat: 62,
          effort: 0,
          stat: {
            name: "attack",
            url: "https://pokeapi.co/api/v2/stat/2/",
          },
        },
        {
          base_stat: 63,
          effort: 0,
          stat: {
            name: "defense",
            url: "https://pokeapi.co/api/v2/stat/3/",
          },
        },
        {
          base_stat: 80,
          effort: 1,
          stat: {
            name: "special-attack",
            url: "https://pokeapi.co/api/v2/stat/4/",
          },
        },
        {
          base_stat: 80,
          effort: 1,
          stat: {
            name: "special-defense",
            url: "https://pokeapi.co/api/v2/stat/5/",
          },
        },
        {
          base_stat: 60,
          effort: 0,
          stat: {
            name: "speed",
            url: "https://pokeapi.co/api/v2/stat/6/",
          },
        },
      ],
    },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    store = mockStore({
      selectedPokemon: mockSelectedPokemon,
      pokemon: {
        pokemons: { results: [{ name: "bulbasaur" }, { name: "ivysaur" }] },
      },
    });
  });

  it("renders correctly", () => {
    render(
      <Provider store={store}>
        <Select list={[{ name: "HP" }, { name: "Attack" }]} selectType="type" />
      </Provider>
    );
    expect(screen.getByText("Select Stats")).toBeInTheDocument();
    expect(screen.getByTestId("checkbox-HP")).toBeInTheDocument();
    expect(screen.getByTestId("checkbox-Attack")).toBeInTheDocument();
  });

  it("opens and closes dropdown", () => {
    render(
      <Provider store={store}>
        <Select list={[{ name: "HP" }, { name: "Attack" }]} selectType="type" />
      </Provider>
    );
    const dropdown = screen.getByTestId("checkbox");
    fireEvent.click(dropdown);
    expect(screen.getByTestId("checkbox-HP")).toBeVisible();
  });

  it("selects and unselects options", () => {
    render(
      <Provider store={store}>
        <Select list={[{ name: "HP" }, { name: "Attack" }]} selectType="type" />
      </Provider>
    );
    const checkbox = screen.getByTestId("checkbox-HP");
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });

  it("shows selected options in the heading", () => {
    render(
      <Provider store={store}>
        <Select list={[{ name: "HP" }, { name: "Attack" }]} selectType="type" />
      </Provider>
    );
    const dropdown = screen.getByTestId("checkbox");
    fireEvent.click(dropdown);
    fireEvent.click(screen.getByTestId("checkbox-HP"));
    expect(screen.getByText("HP")).toBeInTheDocument();
  });

  it("shows and updates range slider values", () => {
    render(
      <Provider store={store}>
        <Select list={[{ name: "HP" }]} selectType="stat" />
      </Provider>
    );
    const slider = screen.getByTestId("slider-1-HP");
    expect(slider).toHaveValue("70");
  });

  it("calls save function", async () => {
    axios.get.mockResolvedValueOnce({ data: { results: [] } });
    render(
      <Provider store={store}>
        <Select list={[{ name: "HP" }]} selectType="stat" />
      </Provider>
    );
    const saveButton = screen.getByTestId("save");

    fireEvent.click(saveButton);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
  });

  it("calls reset function", () => {
    axios.get.mockResolvedValueOnce({ data: { results: [] } });
    render(
      <Provider store={store}>
        <Select list={[{ name: "HP" }]} selectType="stat" />
      </Provider>
    );
    const resetButton = screen.getByTestId("reset");
    fireEvent.click(resetButton);
    const slider = screen.getByTestId("slider-1-HP");
    expect(slider).toHaveValue("70");
  });
});
