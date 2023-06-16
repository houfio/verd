export function toOptions(options: string[]) {
  return options.map((o) => ({
    key: o,
    value: `${o[0]}${o.substring(1).toLowerCase()}`
  }));
}
