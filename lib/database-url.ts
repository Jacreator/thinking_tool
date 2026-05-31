const PG_SSL_MODES_WITH_CURRENT_VERIFY_FULL_BEHAVIOR = new Set([
  "prefer",
  "require",
  "verify-ca",
])

export function normalizePostgresSslMode(connectionString: string): string {
  if (!connectionString.startsWith("postgres://") && !connectionString.startsWith("postgresql://")) {
    return connectionString
  }

  try {
    const url = new URL(connectionString)
    const sslMode = url.searchParams.get("sslmode")

    if (!sslMode || !PG_SSL_MODES_WITH_CURRENT_VERIFY_FULL_BEHAVIOR.has(sslMode)) {
      return connectionString
    }

    url.searchParams.set("sslmode", "verify-full")
    return url.toString()
  } catch {
    return connectionString
  }
}
