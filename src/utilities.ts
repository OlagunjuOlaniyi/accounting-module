import { notification } from 'antd-notifications-messages';
import moment, { Moment } from 'moment';
import { SchoolData } from './types/studentTypes';

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
export function groupTransactionsByTransactionTypeName(data: any) {
  const groupedTransactions = data.reduce((acc: any, transaction: any) => {
    const { name } = transaction.transaction_type;
    const existingGroup = acc.find((group: any) => group.name === name);
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

interface Response {
  month: string;
  expense: string;
  income: string;
}
export function mergeMonths(
  responses1: Response[],
  responses2: Response[]
): string[] {
  // Combine both arrays

  const mergedResponses = [...responses1, ...responses2];

  let months = mergedResponses.map((r) => r.month);
  const uniqueMonthsSet = new Set(months);

  // Convert the Set back to an array
  const uniqueMonthsArray = [...uniqueMonthsSet];
  return uniqueMonthsArray;
}

export function deriveStudentArray(
  schoolData: SchoolData
): { id: number; name: string }[] {
  const studentArray: { id: number; name: string }[] = [];

  for (const classroom of Object.values(schoolData)) {
    for (const student of classroom.students) {
      studentArray.push({
        id: student.idx,
        name: `${student.firstname} ${student.lastname}`,
      });
    }
  }

  return studentArray;
}
