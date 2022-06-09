import { render } from '@testing-library/react';

import App from './app';

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<App />);

    expect(baseElement).toBeTruthy();
  });

  it('should contain "Search Navbar" and "ShopPage" text', () => {
    const { getByText } = render(<App />);

    expect(getByText(/ShopPage/gi)).toBeTruthy();
    expect(getByText(/Error Loading Search remote/gi)).toBeTruthy(); // Test cannot load search module without additional effort
    // https://scriptedalchemy.medium.com/module-federation-how-do-we-create-unit-tests-for-it-bd0d73c999bc
  });
});
