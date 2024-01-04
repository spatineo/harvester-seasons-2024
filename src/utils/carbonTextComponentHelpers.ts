export const checkIfFinnishText = (array: Array<{index: number, data: string}>) => {
  const finalArray: Array<{index: number, data: string}> = []
  const buttonDataEnglish = [
    { index: 1, data: "Soil Carbon in General" },
    { index: 2, data: "Forest Management and Soil Carbon" },
    { index: 3, data: "Peatland vs. Mineral Soil" },
    { index: 4, data: "Carbon Literature" },
  ];
  let hasEmptyData = false; 

  array.forEach((arr: { index: number; data: string }) => {
    if (arr.data === '') {
      hasEmptyData = true; 
    } else {
      finalArray.push({ index: arr.index, data: arr.data });
    }
  });

  if (hasEmptyData) {
    finalArray.push(...buttonDataEnglish);
  }
  return finalArray
}

export const checkIfFinnishTextBody = (array: Array<{index: number, data: string}>) => {
  const finalArray: Array<{index: number, data: string}> = []
  const buttonDataEnglish = [
    { index: 1, data: "Soil Carbon in General" },
    { index: 2, data: "Forest Management and Soil Carbon" },
    { index: 3, data: "Peatland vs. Mineral Soil" },
    { index: 4, data: "Carbon Literature" },
  ];
  let hasEmptyData = false; 

  array.forEach((arr: { index: number; data: string }) => {
    if (arr.data === '') {
      hasEmptyData = true; 
    } else {
      finalArray.push({ index: arr.index, data: arr.data });
    }
  });

  if (hasEmptyData) {
    finalArray.push(...buttonDataEnglish);
  }
  return finalArray
}
