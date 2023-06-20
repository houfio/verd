export function toOptions(options: string[], lower = true) {
  return options.map((o) => ({
    key: o,
    value: lower ? `${o[0]}${o.substring(1).toLowerCase()}` : o
  }));
}
