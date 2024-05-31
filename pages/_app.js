import React from 'react';
import { WindowWidthProvider } from '../components/hooks/useWindowWidth';

const App = ({ Component, pageProps }) => (
  <WindowWidthProvider>
    <React.Fragment>
      <Component {...pageProps} />
    </React.Fragment>
  </WindowWidthProvider>
);

export default App;
