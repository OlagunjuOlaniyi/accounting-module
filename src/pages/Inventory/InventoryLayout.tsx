import { useEffect, useState } from 'react';
import Button from '../../components/Button/Button';

import { inventoryTabs } from '../../data';
import Addcircle from '../../icons/Addcircle';
import Calendar from '../../icons/Calendar';
import Clear from '../../icons/Clear';
import Export from '../../icons/Export';
import Filter from '../../icons/Filter';
import Search from '../../icons/Search';
import './inventory.scss';

import RightCaret from '../../icons/RightCaret';
import { DateRange } from 'react-date-range';
import { calcDiffInDays } from '../../utilities';
import moment from 'moment';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css';
import { useDebounce } from 'use-debounce';
import SmallSpinner from '../../assets/smallspinner.svg';
import { downloadInventory } from '../../services/inventoryService';

// import { downloadIncome } from '../../services/incomeService';
import ProductTable from './ProductTable';
import AddProduct from '../../components/Modals/Inventory/AddProduct';
import {
  useGetProducts,
  useSearchProducts,
  useGetDispensedProducts,
} from '../../hooks/queries/inventory';

import { baseURL } from '../../services/utils';
import DispensedProductTable from './DispensedProductTable';
import Header from '../../components/Header/Header';

const InventoryLayout = () => {
  const [activeTab, setActiveTab] = useState<string>('all products');
  const [searchText, setSearchText] = useState<string>('');
  const [showAddModal, setShowAddmodal] = useState<boolean>(false);
  const [showDateFilters, setShowDateFilters] = useState<boolean>(false);
  const [showDateRange, setShowDateRange] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<any>([]);
  const [state, setState] = useState<any>([
    {
      startDate: new Date(),
      endDate: null,
      key: 'selection',
    },
  ]);

  const [debouncedValue] = useDebounce(searchText, 1000);

  const closeModal = (type: string) => {
    setShowAddmodal(false);
  };

  const { data, isLoading } = useGetProducts();

  const { data: dispensedData } = useGetDispensedProducts();

  // //filter for today
  // const fetchToday = () => {
  //   setState([
  //     {
  //       startDate: new Date(),
  //       endDate: new Date(),
  //       key: 'selection',
  //     },
  //   ]);

  //   setTimeout(() => {
  //     refetch();
  //   }, 500);
  // };

  let searchres = useSearchProducts(debouncedValue).data;
  let searchLoading = useSearchProducts(debouncedValue).isLoading;

  const filterData = () => {
    let filtered = data?.data?.filter(
      (el) => el.status?.toLowerCase() === activeTab
    );

    setFilteredData(filtered);
  };

  useEffect(() => {
    filterData();
  }, [activeTab]);

  const download = async () => {
    try {
      const res = await downloadInventory();
      window.open(res?.pdf_url, '_blank');
      // window.open(`${baseURL}${res.pdf_url}`, '_blank');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Header />
      <div className='ie_overview'>
        <h2 className='ie_overview__title'>Inventory Management</h2>
      </div>
      <div className='ie_overview__top-level'>
        <div className='ie_overview__top-level__search'>
          {/* {' '} */}
          <Search />
          <input
            placeholder='Search by product name'
            className='ie_overview__top-level__search__input'
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
          />
          {/* {searchText && (
            <div
              className="ie_overview__top-level__search__dropdown-menu"
              onClick={(e: any) => e.stopPropagation()}
            >
              <div className="ie_overview__top-level__search__dropdown-menu__top">
                <h3>Recent Search</h3>
                <p>Clear All</p>
              </div>
              <div className="ie_overview__top-level__search__dropdown-menu__list">
                {recentSearch.map((s) => (
                  <div
                    className="ie_overview__top-level__search__dropdown-menu__list__item"
                    key={s.id}
                  >
                    <p>{s.title}</p>
                    <div className="ie_overview__top-level__search__dropdown-menu__list__item__cat">
                      <div className={s.type}></div>
                      <p>{s.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )} */}
          {searchText && (
            <div
              style={{ marginTop: '5px', cursor: 'pointer' }}
              onClick={() => setSearchText('')}
            >
              {searchLoading ? <img src={SmallSpinner} alt='' /> : <Clear />}
            </div>
          )}
        </div>

        <div className='ie_overview__top-level__filter-date-wrap'>
          <button
            className='ie_overview__top-level__filter-date'
            onClick={() => {
              setShowDateFilters(!showDateFilters);
              setShowDateRange(false);
            }}
          >
            {' '}
            <Calendar />
            <p>Filters</p>
          </button>

          {showDateRange && (
            <div className='ie_overview__top-level__filter-date-wrap__dropdown'>
              <DateRange
                editableDateInputs={true}
                onChange={(item) => setState([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={state}
              />
              <div className='ie_overview__top-level__filter-date-wrap__dropdown__footer'>
                <p>
                  {calcDiffInDays(
                    moment(state[0].startDate),
                    moment(state[0].endDate)
                  )}{' '}
                  day(s) selected
                </p>
                <Button
                  btnText='Apply Date'
                  btnClass='btn-primary'
                  width='97px'
                  disabled={false}
                  onClick={() => {}}
                />
              </div>
            </div>
          )}
          {showDateFilters && (
            <div className='ie_overview__top-level__filter-date-wrap__dropdown'>
              <div className='ie_overview__top-level__btn-wrap__dropdown__item'>
                <p>Today</p>
              </div>
              <div className='ie_overview__top-level__btn-wrap__dropdown__item'>
                <p>Yesterday</p>
              </div>

              <div
                className='ie_overview__top-level__btn-wrap__dropdown__item'
                onClick={() => {
                  setShowDateRange(true);
                  setShowDateFilters(false);
                }}
              >
                <p>Custom Date</p>
                <RightCaret />
              </div>
            </div>
          )}
        </div>

        {showDateFilters && (
          <button className='ie_overview__top-level__filter-date' disabled>
            {' '}
            <Filter />
            <p>Filter</p>
          </button>
        )}
        <button
          className='ie_overview__top-level__filter-download'
          onClick={() => download()}
        >
          {' '}
          <Export />
          <p>Download</p>
        </button>
        <div className='ie_overview__top-level__btn-wrap'>
          <Button
            btnText='Add New Product'
            btnClass='btn-primary'
            width='214px'
            icon={<Addcircle />}
            disabled={false}
            onClick={() => setShowAddmodal(!showAddModal)}
          />
        </div>
      </div>

      <div className='ie_overview__tabs'>
        {inventoryTabs.map((el) => (
          <div
            key={el.id}
            onClick={() => setActiveTab(el.title?.toLowerCase())}
          >
            <div
              className={`ie_overview__tabs__single__${
                activeTab?.toLowerCase() === el.title?.toLowerCase()
                  ? 'active-tab'
                  : 'inactive-tab'
              }`}
            >
              {el.title}
            </div>
          </div>
        ))}
      </div>

      <div>
        {activeTab.toLowerCase() === 'dispensed products' ? (
          <DispensedProductTable
            filteredData={dispensedData || []}
            isLoading={isLoading}
            searchRes={searchres}
          />
        ) : (
          <ProductTable
            filteredData={
              activeTab === 'all products' ? data?.data : filteredData
            }
            isLoading={isLoading}
            searchRes={searchres}
          />
        )}
      </div>

      <AddProduct modalIsOpen={showAddModal} closeModal={closeModal} />
    </div>
  );
};

export default InventoryLayout;
