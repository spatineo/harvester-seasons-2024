interface DataItem {
  [key: string]: number | string;
}

interface ArrayObject {
  utctime: string;
  val: string | null;
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

/* export function nonNull(arr: ArrayObject){
 return arr.map((item) => {

 })
} */

function mapObjects(
  arr: ArrayObject[],
  arr2: ArrayObject[]
) {
  const nullIndex = arr.findIndex((item) => item.val === null);
  if (nullIndex === -1) {
    const lastArrIndex = arr.length - 1;
    return arr.map((item, index): (string | number)[] => {
      const props = Object.keys(item).filter((key) => key !== "utctime");
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      const values = props.map((key)=> (item[key] === null ? "nan" : item[key]));

      if (index === lastArrIndex) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment
        return [item.utctime, ...values, ...arr2.map((arr2Item) => arr2Item.val as unknown as (string | number)[])];
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return
        return [item.utctime, ...values];
      }
    });
  }

  return arr.map((item, index): (string | number)[] => {
    if (index < nullIndex) {
      const props = Object.keys(item).filter((key) => key !== "utctime");

      const values = props.map((key) =>
        item[key] === null ? "nan" : (item[key] as string | number)
      );

      return [item.utctime, ...values];
    } else {
      const arr2Item = arr2[index - nullIndex];
      return [item.utctime, arr2Item.val as string | number];
    }
  });
}
