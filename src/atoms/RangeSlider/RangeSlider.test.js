import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import RangeSlider from './RangeSlider'; 
import "@testing-library/jest-dom";

jest.mock('./RangeSlider.scss', () => ({}));

describe('RangeSlider Component', () => {
  const defaultValues = { min: 70, max: 150 };
  
  it('renders without crashing', () => {
    const { container } = render(<RangeSlider sliderId="1" defaultValues={defaultValues} onRangeChange={() => {}} />);
    expect(container).toBeInTheDocument();
  });

  it('displays correct initial values from defaultValues prop', () => {
    const { getByDisplayValue } = render(<RangeSlider sliderId="1" defaultValues={defaultValues} onRangeChange={() => {}} />);
    const slider1 = getByDisplayValue('70');
    const slider2 = getByDisplayValue('150');
    expect(slider1).toBeInTheDocument();
    expect(slider2).toBeInTheDocument();
  });

  it('updates slider values when the slider is moved', () => {
    const { getByDisplayValue, rerender } = render(<RangeSlider sliderId="1" defaultValues={defaultValues} onRangeChange={() => {}} />);
    
    const slider1 = getByDisplayValue('70');
    fireEvent.change(slider1, { target: { value: 100 } });
    rerender(<RangeSlider sliderId="1" defaultValues={{ min: 100, max: 150 }} onRangeChange={() => {}} />);
    expect(slider1.value).toBe('100');
    
    const slider2 = getByDisplayValue('150');
    fireEvent.change(slider2, { target: { value: 200 } });
    rerender(<RangeSlider sliderId="1" defaultValues={{ min: 100, max: 200 }} onRangeChange={() => {}} />);
    expect(slider2.value).toBe('200');
  });

  it('calls onRangeChange when the range values change', () => {
    const onRangeChange = jest.fn();
    const { getByDisplayValue } = render(<RangeSlider sliderId="1" defaultValues={defaultValues} onRangeChange={onRangeChange} />);
    
    const slider1 = getByDisplayValue('70');
    fireEvent.change(slider1, { target: { value: 90 } });
    expect(onRangeChange).toHaveBeenCalledWith({ min: 90, max: 150 });
    
    const slider2 = getByDisplayValue('150');
    fireEvent.change(slider2, { target: { value: 200 } });
    expect(onRangeChange).toHaveBeenCalledWith({ min: 90, max: 200 });
  });

  it('updates the background color of the slider track correctly', () => {
    const { container } = render(<RangeSlider sliderId="1" defaultValues={defaultValues} onRangeChange={() => {}} />);
    const track = container.querySelector('.slider-track-1');
    expect(track).toHaveStyle('background: linear-gradient(to right, #93B2B2 33.3333%, #2E3156 33.3333%, #2E3156 71.4286%, #93B2B2 71.4286%)');
  });

  it('updates the tooltip positions correctly', () => {
    const { container } = render(<RangeSlider sliderId="1" defaultValues={defaultValues} onRangeChange={() => {}} />);
    
    const tooltip1 = container.querySelector('#slider-tooltip-1-1');
    const tooltip2 = container.querySelector('#slider-tooltip-2-1');
    
    expect(tooltip1).toBeInTheDocument();
    expect(tooltip1.style.left).toBeTruthy();
    
    expect(tooltip2).toBeInTheDocument();
    expect(tooltip2.style.left).toBeTruthy();
  });
});
