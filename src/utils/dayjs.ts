import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

export const useDayjs = () => {
  return dayjs;
};
