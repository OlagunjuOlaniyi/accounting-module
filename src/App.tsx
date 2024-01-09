import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { CurrencyProvider } from './context/CurrencyContext';

import { routes } from './routes';
import { AuthProvider } from './context/AuthContext';

function App() {
  const reactQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <AuthProvider>
      <CurrencyProvider>
        <QueryClientProvider client={reactQueryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <BrowserRouter>
            <Routes>
              {Object.values(routes).map((el) => (
                <Route path={el.path} key={el.id} element={<el.component />} />
              ))}
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
}

export default App;
