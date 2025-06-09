
export const mockCompanySearch = (query: string) => {
  // Simple mock search that returns some sample companies
  const mockCompanies = [
    {
      name: "Slovak Telekom, a.s.",
      ico: "35763469",
      dic: "2020845843",
      street: "Bajkalská 28",
      city: "Bratislava",
      zipCode: "81762",
      court: "Okresný súd Bratislava I",
      section: "Sa",
      insertNumber: "4677/B"
    },
    {
      name: "Orange Slovensko, a.s.",
      ico: "35697270", 
      dic: "2020317808",
      street: "Metodova 8",
      city: "Bratislava",
      zipCode: "82109",
      court: "Okresný súd Bratislava I",
      section: "Sa",
      insertNumber: "2988/B"
    }
  ];

  if (!query || query.length < 2) {
    return [];
  }

  return mockCompanies.filter(company => 
    company.name.toLowerCase().includes(query.toLowerCase()) ||
    company.ico.includes(query)
  );
};
