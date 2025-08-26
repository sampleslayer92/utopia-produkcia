import { TFunction } from 'i18next';

// Mapping database titles to translation keys
const COLUMN_TITLE_MAP: { [key: string]: string } = {
  'Nové žiadosti': 'deals.columnTitles.newRequests',
  'V spracovaní': 'deals.columnTitles.inProgress',
  'Na schválenie': 'deals.columnTitles.pendingApproval',
  'Dokončené': 'deals.columnTitles.completed',
  'Zastavené': 'deals.columnTitles.stopped',
  'New Requests': 'deals.columnTitles.newRequests',
  'In Progress': 'deals.columnTitles.inProgress',
  'Pending Approval': 'deals.columnTitles.pendingApproval',
  'Completed': 'deals.columnTitles.completed',
  'Stopped': 'deals.columnTitles.stopped'
};

/**
 * Maps database column title to translated title
 * @param dbTitle - Title from database
 * @param t - Translation function
 * @returns Translated title or original title if no mapping found
 */
export const getTranslatedColumnTitle = (dbTitle: string, t: TFunction): string => {
  const translationKey = COLUMN_TITLE_MAP[dbTitle];
  return translationKey ? t(translationKey) : dbTitle;
};

/**
 * Checks if a column title has a translation mapping
 * @param dbTitle - Title from database
 * @returns True if translation mapping exists
 */
export const hasColumnTitleTranslation = (dbTitle: string): boolean => {
  return dbTitle in COLUMN_TITLE_MAP;
};