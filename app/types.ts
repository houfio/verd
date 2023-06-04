export type ArrayType<T> = T extends Array<infer V> ? V : never;
