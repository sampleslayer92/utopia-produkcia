export interface Bank {
  code: string;
  name: string;
  country: 'SK' | 'CZ';
}

export const banks: Bank[] = [
  // Slovak banks
  { code: '1100', name: 'Tatra banka', country: 'SK' },
  { code: '0900', name: 'Slovenská sporiteľňa', country: 'SK' },
  { code: '0200', name: 'VÚB banka', country: 'SK' },
  { code: '7500', name: 'Československá obchodná banka', country: 'SK' },
  { code: '8360', name: 'Komerčná banka', country: 'SK' },
  { code: '6500', name: 'PRIMA banka Slovensko', country: 'SK' },
  { code: '5600', name: 'Dexia banka Slovensko', country: 'SK' },
  { code: '7300', name: 'Poštová banka', country: 'SK' },
  { code: '3100', name: 'VOLKSBANK Slovensko', country: 'SK' },
  { code: '1111', name: 'UniCredit Bank Slovakia', country: 'SK' },
  { code: '8320', name: 'mBank', country: 'SK' },
  { code: '8330', name: 'OTP Banka Slovensko', country: 'SK' },
  { code: '8170', name: 'Fio banka', country: 'SK' },
  { code: '8340', name: 'WOOD & Company Financial Services', country: 'SK' },
  { code: '6200', name: 'COMMERZBANK Bratislava', country: 'SK' },
  { code: '7930', name: 'Wüstenrot stavebná sporiteľňa', country: 'SK' },
  { code: '7940', name: 'Raiffeisen stavebná sporiteľňa', country: 'SK' },
  
  // Czech banks
  { code: '0100', name: 'Komerční banka', country: 'CZ' },
  { code: '0300', name: 'Československá obchodní banka', country: 'CZ' },
  { code: '0600', name: 'MONETA Money Bank', country: 'CZ' },
  { code: '0800', name: 'Česká spořitelna', country: 'CZ' },
  { code: '2010', name: 'Fio banka', country: 'CZ' },
  { code: '2020', name: 'Bank of Tokyo-Mitsubishi UFJ (Holland) N.V. Prague Branch', country: 'CZ' },
  { code: '2030', name: 'Citfin, spořitelní družstvo', country: 'CZ' },
  { code: '2040', name: 'Křemežská spořitelna, spořitelní družstvo', country: 'CZ' },
  { code: '2050', name: 'WPB Capital, spořitelní družstvo', country: 'CZ' },
  { code: '2060', name: 'Citfin, spořitelní družstvo', country: 'CZ' },
  { code: '2070', name: 'Moravský Peněžní Ústav – spořitelní družstvo', country: 'CZ' },
  { code: '2100', name: 'Hypoteční banka', country: 'CZ' },
  { code: '2200', name: 'Peněžní dům, spořitelní družstvo', country: 'CZ' },
  { code: '2220', name: 'Artesa, spořitelní družstvo', country: 'CZ' },
  { code: '2240', name: 'Pražská úvěrová spořitelna, a.s.', country: 'CZ' },
  { code: '2250', name: 'Banka CREDITAS a.s.', country: 'CZ' },
  { code: '2700', name: 'UniCredit Bank Czech Republic and Slovakia', country: 'CZ' },
  { code: '3030', name: 'Air Bank', country: 'CZ' },
  { code: '3050', name: 'BNP Paribas Personal Finance SA', country: 'CZ' },
  { code: '3060', name: 'PKO BP S.A., Czech branch', country: 'CZ' },
  { code: '4000', name: 'Expobank CZ a.s.', country: 'CZ' },
  { code: '4300', name: 'Českomoravská záruční a rozvojová banka', country: 'CZ' },
  { code: '5500', name: 'Raiffeisenbank', country: 'CZ' },
  { code: '5800', name: 'J&T BANKA', country: 'CZ' },
  { code: '6000', name: 'PPF banka a.s.', country: 'CZ' },
  { code: '6100', name: 'Equa bank', country: 'CZ' },
  { code: '6200', name: 'COMMERZBANK Aktiengesellschaft, pobočka Praha', country: 'CZ' },
  { code: '6210', name: 'mBank S.A., organizační složka', country: 'CZ' },
  { code: '6300', name: 'BNP Paribas S.A., pobočka Praha', country: 'CZ' },
  { code: '6700', name: 'Všeobecná úverová banka a.s., pobočka Praha', country: 'CZ' },
  { code: '6800', name: 'Sberbank CZ', country: 'CZ' },
  { code: '7910', name: 'Deutsche Bank Aktiengesellschaft Filiale Prag', country: 'CZ' },
  { code: '7940', name: 'Waldviertler Sparkasse Bank AG', country: 'CZ' },
  { code: '7950', name: 'Raiffeisen stavební spořitelna a.s.', country: 'CZ' },
  { code: '7960', name: 'Českomoravská stavební spořitelna, a.s.', country: 'CZ' },
  { code: '7970', name: 'Wüstenrot - stavební spořitelna a.s.', country: 'CZ' },
  { code: '7980', name: 'Wüstenrot hypoteční banka a.s.', country: 'CZ' },
  { code: '7990', name: 'Modrá pyramida stavební spořitelna, a.s.', country: 'CZ' },
  { code: '8030', name: 'Volksbank Raiffeisenbank Nordoberpfalz eG pobočka Cheb', country: 'CZ' },
  { code: '8040', name: 'Oberbank AG pobočka Praha', country: 'CZ' },
  { code: '8090', name: 'Česká exportní banka, a.s.', country: 'CZ' },
  { code: '8150', name: 'HSBC Bank plc - pobočka Praha', country: 'CZ' },
  { code: '8190', name: 'Société Générale - pobočka Praha', country: 'CZ' },
  { code: '8200', name: 'PRIVAT BANK der Raiffeisenlandesbank Oberösterreich Aktiengesellschaft', country: 'CZ' },
  { code: '8215', name: 'Bank Gutmann Aktiengesellschaft, pobočka Praha', country: 'CZ' },
  { code: '8220', name: 'PayPal Europe S.à r.l. et Cie, S.C.A., pobočka Praha', country: 'CZ' },
  { code: '8230', name: 'EURAM Bank GmbH pobočka Praha', country: 'CZ' },
  { code: '8240', name: 'Sberbank Europe AG, organizační složka', country: 'CZ' },
  { code: '8250', name: 'Bank of China (CEE) Ltd. Prague Branch', country: 'CZ' },
  { code: '8260', name: 'ANO spořitelní družstvo', country: 'CZ' },
  { code: '8270', name: 'Fairplay Capital, spořitelní družstvo', country: 'CZ' },
  { code: '8280', name: 'B2B European Bank, spořitelní družstvo', country: 'CZ' },
  { code: '8290', name: 'Zuno Bank AG, organizační složka', country: 'CZ' }
];

export const getBankByCode = (code: string): Bank | undefined => {
  return banks.find(bank => bank.code === code);
};

export const getBankName = (code: string): string => {
  const bank = getBankByCode(code);
  return bank ? `${bank.code} - ${bank.name}` : code;
};