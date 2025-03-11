import { format } from 'date-fns';
import { pl, enUS } from 'date-fns/locale';
import i18next from 'i18next';

export const formatDate = (date) => {
  const locales = {
    en: enUS,
    pl: pl
  };
  
  return format(
    new Date(date),
    'PPP', // Long date format
    { locale: locales[i18next.language] || enUS }
  );
};

export const formatNumber = (number) => {
  return new Intl.NumberFormat(i18next.language).format(number);
};