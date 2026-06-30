import path from 'node:path'
import { defineConfig } from 'prisma/config'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

export default defineConfig({
  schema: path.join(__dirname, 'prisma/schema.prisma'),
  migrate: {
    async adapter() {
      const client = createClient({
        url: `file:${path.join(__dirname, 'dev.db')}`,
      })
      return new PrismaLibSQL(client)
    },
  },
})
