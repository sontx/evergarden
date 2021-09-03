export function updateListObjects(
  currentList: any[],
  updateItem: any,
  compare: (item1: any, item2: any) => boolean,
) {
  let isUpdated = false;
  let updatedList = currentList.map((item: any) => {
    if (compare(item, updateItem)) {
      isUpdated = true;
      return { ...item, ...updateItem };
    }
    return item;
  });
  return isUpdated ? updatedList : [...currentList, updateItem];
}
