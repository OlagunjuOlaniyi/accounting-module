import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';

import { routes } from './routes';

function App() {
  const reactQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return (
    <QueryClientProvider client={reactQueryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <div className='nav'>
          <NavLink
            to={'/income-and-expense'}
            className={({ isActive, isPending }) =>
              isPending ? 'pending-nav' : isActive ? 'active-nav' : ''
            }
          >
            Income and Expense
          </NavLink>
          <NavLink
            to={'/chart-of-account'}
            className={({ isActive, isPending }) =>
              isPending ? 'pending-nav' : isActive ? 'active-nav' : ''
            }
          >
            Chart of account
          </NavLink>

          <NavLink
            to={'/asset-and-liability'}
            className={({ isActive, isPending }) =>
              isPending ? 'pending-nav' : isActive ? 'active-nav' : ''
            }
          >
            Asset and Liability
          </NavLink>
          <NavLink
            to={'/bills-fees-management'}
            className={({ isActive, isPending }) =>
              isPending ? 'pending-nav' : isActive ? 'active-nav' : ''
            }
          >
            Bills and Fees Management
          </NavLink>
          <NavLink
            to={'/inventory'}
            className={({ isActive, isPending }) =>
              isPending ? 'pending-nav' : isActive ? 'active-nav' : ''
            }
          >
            Inventory
          </NavLink>
          <NavLink
            to={'/banks'}
            className={({ isActive, isPending }) =>
              isPending ? 'pending-nav' : isActive ? 'active-nav' : ''
            }
          >
            Banks
          </NavLink>
          <NavLink
            to={'/payroll'}
            className={({ isActive, isPending }) =>
              isPending ? 'pending-nav' : isActive ? 'active-nav' : ''
            }
          >
            Payroll
          </NavLink>
        </div>
        <Routes>
          {Object.values(routes).map((el) => (
            <Route path={el.path} key={el.id} element={<el.component />} />
          ))}
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
