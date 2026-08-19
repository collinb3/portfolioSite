import { neon } from '@neondatabase/serverless'

// Shared Neon SQL client. `neon()` returns a tagged-template query function —
// use it as: await sql`select * from services where id = ${id}`
// This reads the connection string from Vercel's environment variables
// (and from .env.local when running `vercel dev` locally).
export const sql = neon(process.env.POSTGRES_CONNECTION_STRING)
