import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Button from '../../components/Button/Button';

import Addcircle from '../../icons/Addcircle';

import Clear from '../../icons/Clear';
import Export from '../../icons/Export';

import Search from '../../icons/Search';

import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css';
import {
  useGetIncomeAndExpenseOverview,
  useSearch,
} from '../../hooks/queries/overview';
import { useDebounce } from 'use-debounce';
import SmallSpinner from '../../assets/smallspinner.svg';
import '../ChartOfAccount/BalanceSheet.scss';

import BankList from './BankList';
import BankModal from '../../components/Modals/BankModal/BankModal';
import Header from '../../components/Header/Header';

const BankLayout = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<string | number>(1);
  const [searchText, setSearchText] = useState<string>('');

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [debouncedValue] = useDebounce(searchText, 1000);

  const closeModal = () => {
    setModalOpen(false);
  };

  const openModal = (type: string) => {
    setModalOpen(true);
  };

  let searchres = useSearch(debouncedValue).data;
  let searchLoading = useSearch(debouncedValue).isLoading;

  //move tab to income after getting response from search
  useEffect(() => {
    if (searchres && activeTab === 1) {
      setActiveTab(2);
    }
  }, [searchres]);
  return (
    <div>
      <Header />
      <div>
        <div className='ie_overview'>
          <h2 className='ie_overview__title'>Bank List</h2>
        </div>
        <div className='ie_overview__top-level'>
          <div className='ie_overview__top-level__search'>
            {' '}
            <Search />
            <input
              placeholder='Search by bank name'
              className='ie_overview__top-level__search__input'
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
            />
            {searchText && (
              <div
                style={{ marginTop: '5px', cursor: 'pointer' }}
                onClick={() => setSearchText('')}
              >
                {searchLoading ? <img src={SmallSpinner} alt='' /> : <Clear />}
              </div>
            )}
          </div>

          <button className='ie_overview__top-level__filter-download'>
            {' '}
            <Export />
            <p>Download</p>
          </button>

          <div className='ie_overview__top-level__btn-wrap'>
            <Button
              btnText='Create Bank List'
              btnClass='btn-primary'
              width='214px'
              icon={<Addcircle />}
              disabled={false}
              onClick={() => setModalOpen(true)}
            />
          </div>
        </div>

        <div>
          <BankList />
        </div>

        <BankModal modalIsOpen={modalOpen} closeModal={closeModal} />
      </div>
    </div>
  );
};

export default BankLayout;
