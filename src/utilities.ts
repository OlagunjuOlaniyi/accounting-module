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
  return diffInDays ? diffInDays : 0;
};
