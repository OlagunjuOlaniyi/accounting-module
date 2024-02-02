import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css';

import './BalanceSheet.scss';
import OverviewCard, {
  ICardProps,
} from '../../components/OverviewCard/OverviewCard';
import Asset from '../../icons/Asset';
import Liability from '../../icons/Liability';
import Equity from '../../icons/Equity';

import { useGetBalanceSheet } from '../../hooks/queries/chartOfAccount';
import { useNavigate } from 'react-router';
import { useCurrency } from '../../context/CurrencyContext';
interface Iprops {
  filteredData?: any;
  filteredLoading: Boolean;
  searchRes?: any;
}
const BalanceSheet = ({filteredLoading, filteredData, searchRes }: Iprops) => {
  const navigate = useNavigate();

  const { data: balance_sheet } = useGetBalanceSheet();
  const { currency } = useCurrency();

  interface ICardDetails extends ICardProps {
    id: number;
  }

  const cardDetails: ICardDetails[] = [
    {
      id: 1,
      title: 'ASSET',
      amount: `${currency} ${
        balance_sheet?.total_asset?.toLocaleString() ?? 0
      }`,
      percentage: '2.4%',
      type: 'profit',
      icon: <Asset />,
    },
    {
      id: 2,
      title: 'LIABILITY',
      amount: `${currency} ${
        balance_sheet?.total_liability?.toLocaleString() ?? 0
      }`,
      percentage: '1.2%',
      type: 'loss',
      icon: <Liability />,
    },
    {
      id: 3,
      title: 'EQUITY',
      amount: `${currency} ${
        balance_sheet?.total_equity?.toLocaleString() ?? 0
      }`,
      percentage: '2.2%',
      type: 'profit',
      icon: <Equity />,
    },
  ];

  let totalLiabilityAndEquity =
    Number(balance_sheet?.total_equity ?? 0) +
    Number(balance_sheet?.total_liability ?? 0);

  const assets = Object.entries(balance_sheet?.asset_by_group || {});
  const liability = Object.entries(balance_sheet?.liability_by_group || {});
  const equity = Object.entries(balance_sheet?.equity_by_group || {});

  return (
    <div>
      <div className='income-expense-overview__cards'>
        {cardDetails.map((el) => (
          <div key={el.id}>
            <OverviewCard
              type={el.type}
              title={el.title}
              percentage={el.percentage}
              amount={el.amount}
              icon={el.icon}
            />
          </div>
        ))}
      </div>

      <div className='income-expense-overview__statement-wrapper'>
        <div className='income-expense-flex' style={{ width: '100%' }}>
          <div style={{ width: '50%' }}>
            {' '}
            <div className='income-expense-overview__statement-wrapper__title'>
              <div className=''>
                <h3>Assets</h3>
              </div>
              <div className=''>
                <h3>AMOUNT</h3>
              </div>
            </div>
            <div className='overview-scroll-container'>
              {assets?.length === 0 ? (
                <div className='empty-state'>No data available</div>
              ) : (
                assets?.map(([group, data]: any) => (
                  <div
                    className='income-expense-overview__statement-wrapper__content'
                    key={group}
                    onClick={() => {
                      navigate(
                        `/chart-of-account/view-balance-sheet/${group}?from=asset_by_group`
                      );
                      localStorage.setItem(
                        'balanceSheet',
                        JSON.stringify({
                          ...balance_sheet?.asset_by_group[group],
                          type: 'bl',
                        })
                      );
                    }}
                  >
                    <div className='income-expense-overview__statement-wrapper__content__left'>
                      <p>{group}</p>
                    </div>
                    <div className='income-expense-overview__statement-wrapper__content__right'>
                      <p>{Number(data.balance).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className='income-expense-overview__statement-wrapper__total'>
              <div className=''>
                <h3>Total Asset</h3>
              </div>
              <div className=''>
                <h3>{balance_sheet?.total_asset?.toLocaleString() ?? 0}</h3>
              </div>
            </div>
          </div>

          <div
            style={{ display: 'flex', flexDirection: 'column', width: '50%' }}
          >
            <div>
              {' '}
              <div className='income-expense-overview__statement-wrapper__title'>
                <div className=''>
                  <h3>Liabilities</h3>
                </div>
                <div className=''>
                  <h3>AMOUNT</h3>
                </div>
              </div>
              <div className='overview-scroll-container'>
                {liability?.length === 0 ? (
                  <div className='empty-state'>No data available</div>
                ) : (
                  liability?.map(([group, data]: any) => (
                    <div
                      className='income-expense-overview__statement-wrapper__content'
                      key={group}
                      onClick={() => {
                        navigate(
                          `/chart-of-account/view-balance-sheet/${group}?from=asset_by_group`
                        );
                        localStorage.setItem(
                          'balanceSheet',
                          JSON.stringify({
                            ...balance_sheet?.liability_by_group[group],
                            type: 'bl',
                          })
                        );
                      }}
                    >
                      <div className='income-expense-overview__statement-wrapper__content__left'>
                        <p>{group}</p>
                      </div>
                      <div className='income-expense-overview__statement-wrapper__content__right'>
                        <p>
                          {' '}
                          <p>{Number(data.balance).toLocaleString()}</p>
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className='income-expense-overview__statement-wrapper__total'>
                <div className=''>
                  <h3>Total Liabilities</h3>
                </div>
                <div className=''>
                  <h3>
                    {currency}{' '}
                    {balance_sheet?.total_liability?.toLocaleString() ?? 0}
                  </h3>
                </div>
              </div>
            </div>

            <div>
              {' '}
              <div className='income-expense-overview__statement-wrapper__title'>
                <div className=''>
                  <h3>Equity</h3>
                </div>
                <div className=''>
                  <h3>AMOUNT</h3>
                </div>
              </div>
              <div className='overview-scroll-container'>
                {equity?.length === 0 ? (
                  <div className='empty-state'>No data available</div>
                ) : (
                  equity.map(([group, data]: any) => (
                    <div
                      className='income-expense-overview__statement-wrapper__content'
                      key={group}
                      onClick={() => {
                        navigate(
                          `/chart-of-account/view-balance-sheet/${group}?from=asset_by_group`
                        );
                        localStorage.setItem(
                          'balanceSheet',
                          JSON.stringify({
                            ...balance_sheet?.equity_by_group[group],
                            type: 'bl',
                          })
                        );
                      }}
                    >
                      <div className='income-expense-overview__statement-wrapper__content__left'>
                        <p>{group}</p>
                      </div>
                      <div className='income-expense-overview__statement-wrapper__content__right'>
                        <p>{Number(data.balance).toLocaleString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div
                className='income-expense-overview__statement-wrapper__total'
                style={{ borderBottom: 'none' }}
              >
                <div className=''>
                  <h3>Total Equity</h3>
                </div>
                <div className=''>
                  <h3>
                    {currency}{' '}
                    {balance_sheet?.total_equity?.toLocaleString() ?? 0}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ paddingBottom: '10px' }}>
          <div
            className='income-expense-overview__statement-wrapper__total balance'
            style={{ borderTop: 'none', marginTop: '5px' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '50%',
                paddingTop: '24px',
                alignItems: 'center',
              }}
            >
              <div className=''>
                <h3>Total Asset</h3>
              </div>
              <div className=''>
                <h3>
                  {currency} {balance_sheet?.total_asset?.toLocaleString()}
                </h3>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '50%',
                paddingLeft: '24px',
                paddingTop: '24px',
                alignItems: 'center',
              }}
            >
              <div className=''>
                <h3>Total Liabilities & Shareholder's Equity</h3>
              </div>
              <div className=''>
                <h3>
                  {currency} {totalLiabilityAndEquity.toLocaleString() ?? 0}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheet;
