export async function filterAsync<T>(
  array: T[],
  filter: (obj: T) => Promise<boolean>
): Promise<T[]> {
  return (
    await Promise.all(
      array.map(
        async obj => {
          if (await filter(obj)) {
            return obj;
          }
          return null;
        }
      )
    )
  ).filter(obj => obj !== null) as unknown as T[];
}