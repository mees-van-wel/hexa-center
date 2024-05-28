type UpdateObject = {
  [key: string]: any;
};

export const updateObjectInArray = <T extends object>(
  array: T[],
  index: number,
  newObject: UpdateObject,
) => array.map((item, i) => (i === index ? { ...item, ...newObject } : item));
