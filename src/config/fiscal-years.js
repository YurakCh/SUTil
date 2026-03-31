export const DEFAULT_FISCAL_DATA = {
  2011: { sbu: 264, digno: 264 },
  2012: { sbu: 292, digno: 292 },
  2013: { sbu: 318, digno: 318 },
  2014: { sbu: 340, digno: 340 },
  2015: { sbu: 354, digno: 354 },
  2016: { sbu: 366, digno: 366 },
  2017: { sbu: 375, digno: 375 },
  2018: { sbu: 386, digno: 386 },
  2019: { sbu: 394, digno: 394 },
  2020: { sbu: 400, digno: 400 },
  2021: { sbu: 400, digno: 400 },
  2022: { sbu: 425, digno: 450.50 },
  2023: { sbu: 450, digno: 484.75 },
  2024: { sbu: 460, digno: 498.90 },
  2025: { sbu: 470, digno: 515.00 },
  2026: { sbu: 482, digno: 530.00 }
};

export const getFiscalData = (year, customData = {}) => {
  const isDefault = !!DEFAULT_FISCAL_DATA[year];
  const data = customData[year] || DEFAULT_FISCAL_DATA[year] || { sbu: 480, digno: 530 };
  return { ...data, isUnknown: !isDefault };
};

export const getAvailableYears = () => {
  const years = [];
  const startYear = 2011;
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed (11 is December)
  
  // The list ends at the current year, UNLESS it's December, then we add the next year.
  const endYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  
  for (let y = startYear; y <= endYear; y++) {
    years.push(y);
  }
  
  return years;
};
