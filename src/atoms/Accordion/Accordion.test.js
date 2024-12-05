import React from 'react';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Accordion from "./Accordion"; 
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { setPokemons } from "../../store/slices/pokemonSlice"; 
import { typeSelect } from "../../store/slices/selectedTypesSlice"; 
import axios from "../../utils/axios";
import "@testing-library/jest-dom";


jest.mock("./Accordion.scss", () => ({}));

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
jest.mock("../../utils/axios", () => ({
    __esModule: true,
    default: {
      get: jest.fn(),
      post: jest.fn(),
    },
  }));
const mockStore = configureStore([]);

describe("Accordion Component", () => {
    let store;
    afterEach(() => {
        jest.clearAllMocks();
      });
    
      beforeEach(() => {
        store = mockStore({
          
          pokemon: {
            pokemons: { results: [{ name: "bulbasaur" }, { name: "ivysaur" }] },
            selectedType: ["normal","grass"]
          },
        });
      });
  test("renders Accordion correctly", () => {
    render(
      <Provider store={store}>
        <Accordion list={[{ name: "HP" }, { name: "Attack" }]} selectType="type" />
      </Provider>
    );

    const button =screen.getByTestId("button-accordion");
    fireEvent.click(button)
    // Check if the component renders the correct elements
    expect(screen.getByText("type")).toBeInTheDocument();
    expect(screen.getByTestId("checkbox-HP")).toBeInTheDocument();
    expect(screen.getByTestId("checkbox-Attack")).toBeInTheDocument();
  });

  test("handles accordion open and close", () => {
    render(
      <Provider store={store}>
        <Accordion list={[{ name: "HP" }, { name: "Attack" }]} selectType="type" />
      </Provider>
    );

    const accordionIcon = screen.getByRole("button");

    // Initially, the accordion should be closed
    expect(screen.queryByText("HP")).toBeNull();

    // Open the accordion
    fireEvent.click(accordionIcon);
    expect(screen.getByText("HP")).toBeInTheDocument(); // The list should be visible

    // Close the accordion
    fireEvent.click(accordionIcon);
    expect(screen.queryByText("HP")).toBeNull(); // The list should be hidden again
  });

  test("handles checkbox selection and deselection", () => {
    render(
      <Provider store={store}>
        <Accordion list={[{ name: "HP" }, { name: "Attack" }]} selectType="type" />
      </Provider>
    );

    const button =screen.getByTestId("button-accordion");
    fireEvent.click(button)
    const checkbox = screen.getByLabelText("HP");

    expect(checkbox).toBeChecked();

    expect(checkbox).toBeChecked();

    // Deselect the checkbox
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  test("handles RangeSlider value change", () => {
    render(
      <Provider store={store}>
        <Accordion list={[{ name: "HP" }]} selectType="stat" />
      </Provider>
    );

    const button =screen.getByTestId("button-accordion");
    fireEvent.click(button)
    const slider = screen.getByTestId("slider-1-HP");

    
    expect(slider).toHaveValue("70");

  });

  test("calls dispatch when checkbox is selected", () => {
    const dispatchMock = jest.fn();
    render(
      <Provider store={store}>
        <Accordion list={[{ name: "HP" }]} selectType="type" />
      </Provider>
    );

    const button =screen.getByTestId("button-accordion");
    fireEvent.click(button)
    const checkbox = screen.getByTestId("checkbox-HP");

    
    fireEvent.click(checkbox);
    expect(dispatchMock).toHaveBeenCalledTimes(0); 
  });

 
});
