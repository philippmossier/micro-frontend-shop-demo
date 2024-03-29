import { render } from '@testing-library/react';

import App from './app';

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<App />);

    expect(baseElement).toBeTruthy();
  });

  it('should contain "Search Navbar" text', () => {
    const { getByText } = render(<App />);

    expect(getByText(/Search Navbar/gi)).toBeTruthy();
  });
});
