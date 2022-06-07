import * as React from 'react';
import NxWelcome from './nx-welcome';
import { Link, Route, Routes } from 'react-router-dom';

const Shop = React.lazy(() => import('shop/Module'));

const Payment = React.lazy(() => import('payment/Module'));

const About = React.lazy(() => import('about/Module'));

const Search = React.lazy(() => import('search/Module'));

export function App() {
  return (
    <React.Suspense fallback={null}>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/shop">Shop</Link>
        </li>

        <li>
          <Link to="/payment">Payment</Link>
        </li>

        <li>
          <Link to="/about">About</Link>
        </li>

        <li>
          <Link to="/search">Search</Link>
        </li>
      </ul>
      <Routes>
        <Route path="/" element={<NxWelcome title="host" />} />

        <Route path="/shop" element={<Shop />} />

        <Route path="/payment" element={<Payment />} />

        <Route path="/about" element={<About />} />

        <Route path="/search" element={<Search />} />
      </Routes>
    </React.Suspense>
  );
}

export default App;
