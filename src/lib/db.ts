// @ts-expect-error - mssql module types
import sql from 'mssql'

const config: sql.config = {
  server: process.env.DB_SERVER!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_DATABASE!,
  port: parseInt(process.env.DB_PORT || '1433'),
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
}

let pool: sql.ConnectionPool | null = null

export async function getConnection(): Promise<sql.ConnectionPool> {
  if (pool) {
    return pool
  }
  pool = await sql.connect(config)
  return pool
}

export async function query<T>(queryString: string, params?: Record<string, unknown>): Promise<T[]> {
  const connection = await getConnection()
  const request = connection.request()

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value)
    })
  }

  const result = await request.query(queryString)
  return result.recordset as T[]
}
