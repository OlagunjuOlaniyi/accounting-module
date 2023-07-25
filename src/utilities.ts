import { notification } from 'antd-notifications-messages';
import moment, { Moment } from 'moment';

export const showNotification = (type: any, title: string, message: string) => {
  notification({
    type,
    title,
    message,
  });
};

//change moment date format to yyyy-mm-dd from mm/dd/yyyy
export const changeDateFormat = (date: Moment | string) => {
  let splittedDate = String(date)?.split('/');
  return `${splittedDate[2]}-${splittedDate[0]}-${splittedDate[1]}`;
};

//calculate diff in dates
export const calcDiffInDays = (startDate: Moment, endDate: Moment) => {
  let start = moment(startDate);
  let end = moment(endDate);
  let diffInDays = end.diff(start, 'days');
  return diffInDays ? diffInDays + 1 : 0;
};

//remove last item in array
export function removeLastItem(arr: any) {
  arr?.pop(); // Removes the last item from the array
  return arr;
}

//calculate total

export function calculateTotalAmount(data: any) {
  const keys = Object.keys(data);
  const totalAmounts = {};

  keys.forEach((key) => {
    const items = data[key];
    const total = items.reduce(
      (acc: any, item: any) => acc + parseFloat(item.amount),
      0
    );
    totalAmounts[key] = total;
  });

  return totalAmounts;
}

//group transactions
export function groupTransactionsByTransactionTypeName(data) {
  const groupedTransactions = data.reduce((acc, transaction) => {
    const { name } = transaction.transaction_type;
    const existingGroup = acc.find((group) => group.name === name);
    const amount = parseFloat(transaction.amount);

    if (existingGroup) {
      existingGroup.amount += amount;
    } else {
      acc.push({ name, amount });
    }

    return acc;
  }, []);

  return groupedTransactions;
}

export function replacePercent20WithSpaces(str: string) {
  return str.replace(/%20/g, ' ');
}
