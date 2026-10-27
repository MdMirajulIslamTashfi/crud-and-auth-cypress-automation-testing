// The ONLY place tags are defined. Specs must use TAG.* through tags(...).
export const TAG = {
  feature: {
    home: '@home',
    register: '@register',
    login: '@login',
  },
  type: {
    smoke: '@smoke',
    happy: '@happy',
    negative: '@negative',
    boundary: '@boundary',
  },
  mod: {
    slow: '@slow',
    security: '@security', // Google login, OTP sending, other secure paths
    manual: '@manual',
    wip: '@wip',
  },
} as const;

type ValuesOf<T> = T extends object ? T[keyof T] : never; // distributes over the 3 groups
export type Tag = ValuesOf<(typeof TAG)[keyof typeof TAG]>;

const known = new Set<string>(
  Object.values(TAG).flatMap((group) => Object.values(group)),
);

// Throws when a spec loads with an unknown/misspelled tag (e.g. TAG.type.negativ -> undefined).
export const tags = (...list: Tag[]): Tag[] => {
  list.forEach((t) => {
    if (!known.has(t)) throw new Error(`Unknown tag: ${String(t)} — add it to support/tags.ts`);
  });
  return list;
};
