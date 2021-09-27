export function mergeObjects(from: any, to: any): any {
  if (typeof from !== 'object' || typeof to !== 'object') {
    throw new Error('Two objects must be object type');
  }

  const toKeys = Object.keys(to);
  const newDest = { ...to };
  for (const toKey of toKeys) {
    const fromValue = from[toKey];
    if (fromValue) {
      newDest[toKey] = fromValue;
    }
  }

  return newDest;
}
