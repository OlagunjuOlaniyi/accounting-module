import React, { useState } from 'react';
import Button from '../../components/Button/Button';
import { recentSearch, tabs } from '../../data';
import Addcircle from '../../icons/Addcircle';
import Calendar from '../../icons/Calendar';
import Clear from '../../icons/Clear';
import Export from '../../icons/Export';
import Filter from '../../icons/Filter';
import Search from '../../icons/Search';
import './incomeexpense.scss';
import IncomeExpenseOverview from './IncomeExpenseOverview';

const IncomeAndExpenseLayout = () => {
  const [activeTab, setActiveTab] = useState<string | number>(1);
  const [searchText, setSearchText] = useState<string>('');

  return (
    <div>
      <div className='ie_overview'>
        <h2 className='ie_overview__title'>Income And Expense Management</h2>
      </div>
      <div className='ie_overview__top-level'>
        <div className='ie_overview__top-level__search'>
          {' '}
          <Search />
          <input
            placeholder='Search by income type, expense type, payment method'
            className='ie_overview__top-level__search__input'
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
          />
          {searchText && (
            <div
              className='ie_overview__top-level__search__dropdown-menu'
              onClick={(e: any) => e.stopPropagation()}
            >
              <div className='ie_overview__top-level__search__dropdown-menu__top'>
                <h3>Recent Search</h3>
                <p>Clear All</p>
              </div>
              <div className='ie_overview__top-level__search__dropdown-menu__list'>
                {recentSearch.map((s) => (
                  <div
                    className='ie_overview__top-level__search__dropdown-menu__list__item'
                    key={s.id}
                  >
                    <p>{s.title}</p>
                    <div className='ie_overview__top-level__search__dropdown-menu__list__item__cat'>
                      <div className={s.type}></div>
                      <p>{s.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {searchText && (
            <div
              style={{ marginTop: '5px', cursor: 'pointer' }}
              onClick={() => setSearchText('')}
            >
              <Clear />
            </div>
          )}
        </div>
        <button className='ie_overview__top-level__filter-date'>
          {' '}
          <Calendar />
          <p>2020</p>
        </button>
        <button className='ie_overview__top-level__filter-date'>
          {' '}
          <Filter />
          <p>Filter</p>
        </button>
        <button className='ie_overview__top-level__filter-date'>
          {' '}
          <Export />
          <p>Export</p>
        </button>
        <Button
          btnText='Record Transaction'
          btnClass='btn-primary'
          width='172px'
          icon={<Addcircle />}
        />
      </div>

      <div className='ie_overview__tabs'>
        {tabs.map((el) => (
          <div key={el.id} onClick={() => setActiveTab(el.id)}>
            <div
              className={`ie_overview__tabs__single__${
                activeTab === el.id ? 'active-tab' : 'inactive-tab'
              }`}
            >
              {el.title}
            </div>
          </div>
        ))}
      </div>
      <div>
        <IncomeExpenseOverview />
      </div>
    </div>
  );
};

export default IncomeAndExpenseLayout;
