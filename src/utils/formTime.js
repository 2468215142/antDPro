import moment from 'moment';
moment.locale('zh-cn');

export const formTime = (date = '', form = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(date).format(form);
};
