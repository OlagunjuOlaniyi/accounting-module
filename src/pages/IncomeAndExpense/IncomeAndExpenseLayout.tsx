import React, { useState } from 'react';
import Button from '../../components/Button/Button';
import RecordExpense from '../../components/Modals/IncomeAndExpense/RecordExpense';
import RecordIncome from '../../components/Modals/IncomeAndExpense/RecordIncome';
import { recentSearch, tabs } from '../../data';
import Addcircle from '../../icons/Addcircle';
import Calendar from '../../icons/Calendar';
import Clear from '../../icons/Clear';
import Export from '../../icons/Export';
import Filter from '../../icons/Filter';
import Search from '../../icons/Search';
import './incomeexpense.scss';
import IncomeExpenseOverview from './IncomeExpenseOverview';
import IncomeTable from './IncomeTable';

const IncomeAndExpenseLayout = () => {
  const [activeTab, setActiveTab] = useState<string | number>(1);
  const [searchText, setSearchText] = useState<string>('');
  const [showActions, setShowActions] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<any>({
    income: false,
    expense: false,
  });

  const closeModal = (type: string) => {
    setModalOpen({ income: false, expense: false });
  };

  const openModal = (type: string) => {
    type === 'income'
      ? setModalOpen({ income: true, expense: false })
      : setModalOpen({ income: false, expense: true });
  };

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
        <div className='ie_overview__top-level__btn-wrap'>
          <Button
            btnText='Record Transaction'
            btnClass='btn-primary'
            width='172px'
            icon={<Addcircle />}
            onClick={() => setShowActions(!showActions)}
          />
          {showActions && (
            <div className='ie_overview__top-level__btn-wrap__dropdown'>
              <div
                className='ie_overview__top-level__btn-wrap__dropdown__item'
                onClick={() => openModal('income')}
              >
                <div className={'income'}></div>
                <p>Income</p>
              </div>
              <div
                className='ie_overview__top-level__btn-wrap__dropdown__item'
                onClick={() => openModal('expense')}
              >
                <div className={'expense'}></div>
                <p>Expense</p>
              </div>
            </div>
          )}
        </div>
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
        {activeTab === 1 && <IncomeExpenseOverview />}
        {activeTab === 2 && <IncomeTable />}
      </div>
      <RecordIncome modalIsOpen={modalOpen.income} closeModal={closeModal} />
      <RecordExpense modalIsOpen={modalOpen.expense} closeModal={closeModal} />
    </div>
  );
};

export default IncomeAndExpenseLayout;
