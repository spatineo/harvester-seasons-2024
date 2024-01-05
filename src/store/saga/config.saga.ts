interface DataItem {
  [key: string]: number | string;
}

export const filterFirstDayOfMonth = (data: DataItem[]) => {
  return data.filter((item, index) => {
    if (index === 0) {
      return true;
    } else {
      const currentDate = new Date(item.utctime);
      const prevDate = new Date(data[index - 1].utctime);
      return (
        currentDate.getMonth() !== prevDate.getMonth() ||
        currentDate.getDate() === 1
      );
    }
  });
};

export function createGraphData(arr: DataItem[]) {
  return arr.map((item) => {
    const props: string[] = Object.keys(item).filter(
      (key) => key !== "utctime"
    );
    const values = props.map((key) => (item[key] === null ? "nan" : item[key]));
    return [item.utctime, ...values];
  });
}