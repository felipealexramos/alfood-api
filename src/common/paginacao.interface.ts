/** Django REST Framework style pagination envelope consumed by the vitrine. */
export interface Paginacao<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
