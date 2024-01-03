interface DataItem {
  utctime: string;
  [key: string]: number | string;
}
export const filterFirstDayOfMonth = (data: DataItem[]) => {
  return data.filter((item, index) => {
    if (index === 0) {
      return true;
    } else {
      const currentDate = new Date(item.utctime);
      const prevDate = new Date(data[index - 1].utctime);
      return currentDate.getMonth() !== prevDate.getMonth() || currentDate.getDate() === 1;
    }
  });
};
