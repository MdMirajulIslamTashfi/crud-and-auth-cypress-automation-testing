import { Tag, tags } from './tags';

const ID_FORMAT = /^[A-Z]{2,5}-[A-Z]\d{2,3}$/; // e.g. REG-N03
const seen = new Set<string>();

function register(id: string) {
  if (!ID_FORMAT.test(id)) throw new Error(`Bad case id "${id}" (expected like REG-N03)`);
  if (seen.has(id)) throw new Error(`Duplicate case id: ${id}`);
  seen.add(id);
}

/** One test. The ID is put in the title so `--expose grep=REG-N03` runs just this case. */
export function testCase(id: string, title: string, run: () => void, extraTags: Tag[] = []) {
  register(id);
  it(`${id} ${title}`, { tags: tags(...extraTags) }, run);
}

export interface Case {
  id: string;
  title: string;
  tags?: Tag[]; // optional per-row tags, e.g. [TAG.mod.security]
}

/** A case table: one row = one test, one body for the whole table. */
export function eachCase<T extends Case>(table: T[], run: (row: T) => void) {
  table.forEach((row) => testCase(row.id, row.title, () => run(row), row.tags));
}
