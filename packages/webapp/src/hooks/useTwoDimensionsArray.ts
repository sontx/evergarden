import { useEffect, useState } from "react";

export function useTwoDimensionsArray<T>(array2?: T[][]) {
  const [data, setData] = useState<T[]>();
  useEffect(() => {
    if (array2) {
      const temp: T[] = [];
      for (const row of array2) {
        for (const cell of row) {
          temp.push(cell);
        }
      }
      setData(temp);
    } else {
      setData(array2);
    }
  }, [array2]);
  return data;
}
