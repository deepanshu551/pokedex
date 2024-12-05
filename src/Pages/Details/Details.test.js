import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import "@testing-library/jest-dom";
import Details from "./Details";
import axios from "../../utils/axios"
jest.mock('./Details.scss', () => ({}));
jest.mock('../../styles/typeColor.scss', () => ({}));
jest.mock('../../Components/PokeCard/PokeCard', () => () => <div data-testid="pokemon-card">PokemonCard</div>);
jest.mock('../../atoms/Progressbar/Progressbar', () => () => <div data-testid="progressbar">Progressbar</div>);
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
  }));

jest.mock("../../utils/axios", () => ({
    __esModule: true, 
    default: {
      get: jest.fn(),
      post: jest.fn(),
    },
  }));
const mockStore = configureStore([]);

describe("Details Component", () => {
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
      "base_stat": 60,
      "effort": 0,
      "stat": {
        "name": "hp",
        "url": "https://pokeapi.co/api/v2/stat/1/"
      }
    },
    {
      "base_stat": 62,
      "effort": 0,
      "stat": {
        "name": "attack",
        "url": "https://pokeapi.co/api/v2/stat/2/"
      }
    },
    {
      "base_stat": 63,
      "effort": 0,
      "stat": {
        "name": "defense",
        "url": "https://pokeapi.co/api/v2/stat/3/"
      }
    },
    {
      "base_stat": 80,
      "effort": 1,
      "stat": {
        "name": "special-attack",
        "url": "https://pokeapi.co/api/v2/stat/4/"
      }
    },
    {
      "base_stat": 80,
      "effort": 1,
      "stat": {
        "name": "special-defense",
        "url": "https://pokeapi.co/api/v2/stat/5/"
      }
    },
    {
      "base_stat": 60,
      "effort": 0,
      "stat": {
        "name": "speed",
        "url": "https://pokeapi.co/api/v2/stat/6/"
      }
    }
  ]
    },
  };

  const mockGenderList = {
    genderList: {
      male: ["bulbasaur"],
      female: ["bulbasaur"],
      genderless: [],
    },
  };

  afterEach(() => {
    // Clear any mocks after each test
    jest.clearAllMocks();
  });
  beforeEach(() => {
    store = mockStore({
      selectedPokemon: mockSelectedPokemon,
      genderList: mockGenderList,
      pokemon: { pokemons: { results: [{ name: "bulbasaur" }, { name: "ivysaur" }] } },
    });
  });

  test("renders Details component with initial data", () => {
render(
      <Provider store={store}>
        <Details />
      </Provider>
    );

  
    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
    expect(screen.getByText("height")).toBeInTheDocument();
    expect(screen.getByText(/2' 4''/i)).toBeInTheDocument();
    expect(screen.getByText(/overgrow/i)).toBeInTheDocument();
  });

  test("calls API to fetch description and sets state", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        flavor_text_entries: [
          { language: { name: "en" }, flavor_text: "A strange seed was planted." },
          { language: { name: "en" }, flavor_text: "It grows by absorbing sunlight." },
        ],
        egg_groups: [{ name: "plant" }],
      },
    });

    render(
      <Provider store={store}>
        <Details />
      </Provider>
    );

    // Wait for the description to be set
    expect(await screen.findByText(/A strange seed was planted./i)).toBeInTheDocument();

  });

  test("updates description based on screen size", () => {
    global.innerWidth = 800; // Simulate larger screen size
    window.dispatchEvent(new Event("resize"));

    render(
      <Provider store={store}>
        <Details />
      </Provider>
    );

    // Check cropped description for large screen
    const description = screen.getByText(/bulbasaur/i);
    expect(description).toBeInTheDocument();
  });

//   test("navigates to next and previous Pokémon", async () => {
//     axios.get.mockResolvedValueOnce({
//       data: {
//         id: 2,
//         name: "ivysaur",
//       },
//     });

//     render(
//       <Provider store={store}>
//         <Details />
//       </Provider>
//     );
//     const nextButton = screen.getByTestId("right");
//     fireEvent.click(nextButton);
//     // Check for next Pokémon name
//     await waitFor(() => {
//         // Check if the new Pokémon name appears after the API call
//         expect(screen.getByText(/ivysaur/i)).toBeInTheDocument();
//       });
//   });

  test("toggles modal visibility when 'read more' is clicked", () => {
    render(
      <Provider store={store}>
        <Details />
      </Provider>
    );

    const readMoreButton = screen.getByText(/read more/i);
    fireEvent.click(readMoreButton);

    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.click(readMoreButton);

    expect(document.body.style.overflow).toBe("auto");
  });

  test("fetches evolution chain details", async () => {
    const mockEvolutionChain = {
      chain: {
        species: { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon-species/1/" },
        evolves_to: [
          {
            species: { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon-species/2/" },
          },
        ],
      },
    };

    global.fetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockEvolutionChain),
    });

    render(
      <Provider store={store}>
        <Details />
      </Provider>
    );

    expect(await screen.findByText(/ivysaur/i)).toBeInTheDocument();
  });
});
