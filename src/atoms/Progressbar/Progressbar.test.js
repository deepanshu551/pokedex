import React from 'react';
import { render } from '@testing-library/react';
import "@testing-library/jest-dom";
import Progressbar from './Progressbar';  // Assuming the component is named 'Progressbar'
jest.mock('./Progressbar.scss', () => ({}));

describe('Progressbar Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Progressbar stat="Progress" value={50} />);
    expect(container).toBeInTheDocument();
  });

  it('displays the correct stat text', () => {
    const { getByText } = render(<Progressbar stat="Progress" value={50} />);
    expect(getByText("Progress")).toBeInTheDocument();
  });

  it('displays the correct value', () => {
    const { getByText } = render(<Progressbar stat="Progress" value={50} />);
    expect(getByText("50")).toBeInTheDocument();
  });

  it('sets the correct value for the progress element', () => {
    const { container } = render(<Progressbar stat="Progress" value={50} />);
    const progress = container.querySelector('progress');
    expect(progress).toHaveAttribute('value', '50');
    expect(progress).toHaveAttribute('max', '100');
  });

  it('renders with 0 as the default value when no value is passed', () => {
    const { container } = render(<Progressbar stat="Progress" value={0} />);
    const progress = container.querySelector('progress');
    expect(progress).toHaveAttribute('value', '0');
  });

  it('renders with the max value of 100', () => {
    const { container } = render(<Progressbar stat="Progress" value={75} />);
    const progress = container.querySelector('progress');
    expect(progress).toHaveAttribute('max', '100');
  });
});
