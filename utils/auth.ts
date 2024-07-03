import jwt from 'jsonwebtoken'
import { db } from '@/db/db'
import { eq } from 'drizzle-orm'
import { users } from '@/db/schema'
import bcrypt from 'bcrypt'

const SECRET = 'use_an_ENV_VAR'

export const createTokenForUser = (userId: string) => {
  const token = jwt.sign({ id: userId }, SECRET)
  return token
}

export const getUserFromToken = async (header?: string) => {
  if (!header) {
    return null
  }

  const token = (header.split('Bearer')[1] ?? '').trim()
  let id: string

  try {
    const user = jwt.verify(token, SECRET) as { id: string }
    id = user.id
  } catch (e) {
    console.error('invalid jwt', e)
    return null
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
    columns: {
      id: true,
      email: true,
      createdAt: true,
    },
  })

  return user
}

export const signin = async ({
  email,
  password,
}: {
  email: string
  password: string
}) => {
  const match = await db.query.users.findFirst({
    where: eq(users.email, email),
  })

  if (!match) return null

  const correctPW = await comparePW(password, match.password)

  if (!correctPW) {
    return null
  }

  const token = createTokenForUser(match.id)
  const { password: pw, ...user } = match

  return { user, token }
}

export const signup = async ({
  email,
  password,
}: {
  email: string
  password: string
}) => {
  const hashedPW = await hashPW(password)
  const rows = await db
    .insert(users)
    .values({ email, password: hashedPW })
    .returning({
      id: users.id,
      email: users.email,
      createdAt: users.createdAt,
    })

  const user = rows[0]
  const token = createTokenForUser(user.id)

  return { user, token }
}

const hashPW = (password: string) => {
  return bcrypt.hash(password, 10)
}

const comparePW = (password: string, hashedPW: string) => {
  return bcrypt.compare(password, hashedPW)
}
