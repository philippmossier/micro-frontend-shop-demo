import * as React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import FederatedWrapper from './ModuleFederationWrapper/FederatetWrapper';
import wrapComponent from './ModuleFederationWrapper/wrapComponent';

// wrapComponent is an HOC with an ErrorBoundary and also wrapped with React.Suspense to lazy load the module/MicroFrontend
const Shop = wrapComponent(React.lazy(() => import('shop/Module')));
const Payment = wrapComponent(React.lazy(() => import('payment/Module')));
// const Search = wrapComponent(React.lazy(() => import('search/Module')));

// Normal lazy import without wrapComponent (must be wrapped with FederatedWrapper to get the same benefits from ErrorBaundary and React.Suspense)
const About = React.lazy(() => import('about/Module'));

export default function App() {
  return (
    <React.Suspense fallback={null}>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/payment">Payment</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
      <Routes>
        <Route
          path="/"
          element={
            // <>
            //   <Search
            //     delayed={<div>Loading Search ...</div>}
            //     error={<div>Error Loading Search remote</div>}
            //   />
            <Shop
              delayed={<div>Loading shop ...</div>}
              error={<div>Error Loading shop remote</div>}
            />
            // </>
          }
        />

        <Route
          path="/payment"
          element={
            <Payment
              delayed={<div>Loading payment ...</div>}
              error={<div>Error Loading payment remote</div>}
            />
          }
        />

        <Route
          path="/about"
          element={
            <FederatedWrapper
              delayed={<div>Loading about ...</div>}
              error={<div>Error Loading about remote</div>}
            >
              <About />
            </FederatedWrapper>
          }
        />
      </Routes>
    </React.Suspense>
  );
}
