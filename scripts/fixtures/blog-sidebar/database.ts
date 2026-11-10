// In-memory Supabase query spy for tests only. No credentials or real database.
export async function createClient() {
  const state = (globalThis as any).__recentPostsDb
  if (state.failCreate) throw new Error("Fixture database unavailable")
  return {
    from(table: string) {
      state.calls.push(["from", table])
      const filters: Array<[string, string, unknown]> = []
      const ordering: Array<[string, { ascending: boolean; nullsFirst?: boolean }]> = []
      let count = Infinity
      const query = {
        select(columns: string) { state.calls.push(["select", columns]); return query },
        eq(column: string, value: unknown) { state.calls.push(["eq", column, value]); filters.push(["eq", column, value]); return query },
        neq(column: string, value: unknown) { state.calls.push(["neq", column, value]); filters.push(["neq", column, value]); return query },
        order(column: string, options: { ascending: boolean; nullsFirst?: boolean }) { state.calls.push(["order", column, options]); ordering.push([column, options]); return query },
        limit(value: number) { count = value; state.calls.push(["limit", value]); return query },
        then(resolve: (value: unknown) => unknown, reject: (reason: unknown) => unknown) {
          const data = state.rows.filter((row: any) => filters.every(([op, col, value]) => op === "eq" ? row[col] === value : row[col] !== value))
          data.sort((a: any, b: any) => {
            for (const [column, options] of ordering) {
              const x = a[column], y = b[column]
              if (x === y) continue
              if (x == null) return options.nullsFirst ? -1 : 1
              if (y == null) return options.nullsFirst ? 1 : -1
              return (x < y ? -1 : 1) * (options.ascending ? 1 : -1)
            }
            return 0
          })
          return Promise.resolve({ data: data.slice(0, count), error: state.failResult ? { message: "Fixture error" } : null }).then(resolve, reject)
        },
      }
      return query
    },
  }
}
