import React from 'react';
import { prettyDOM, render } from '@testing-library/react';
import Loading from './Loading'; 
import "@testing-library/jest-dom";
describe('Loading Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Loading />);
    expect(container).toBeInTheDocument();
  });

  it('displays the FontAwesome spinner icon', () => {
    const { container } = render(<Loading />);
    const spinnerIcon = container.querySelector('svg');
    expect(spinnerIcon).toBeInTheDocument();
  });
  it('applies the spin class to the icon', () => {
    const { container } = render(<Loading />);
    const spinnerIcon = container.querySelector('svg');
    expect(spinnerIcon).toHaveClass('fa-spin');
  });

  it('displays the spinner with correct size', () => {
    const { container } = render(<Loading />);
    const spinnerIcon = container.querySelector('svg');
    expect(spinnerIcon).toHaveClass('fa-2x');
  });
});
