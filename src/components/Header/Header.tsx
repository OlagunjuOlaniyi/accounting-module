import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  let url = document.referrer
    ? document.referrer.endsWith('/')
      ? document.referrer.replace('https://', '').slice(0, -1)
      : document.referrer.replace('https://', '')
    : 'demo.edves.net';
  //let url = 'demo.edves.net';
  return (
    <div>
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
        {url !== 'demo.edves.net' && (
          <NavLink
            to={'/payroll'}
            className={({ isActive, isPending }) =>
              isPending ? 'pending-nav' : isActive ? 'active-nav' : ''
            }
          >
            Payroll
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Header;
