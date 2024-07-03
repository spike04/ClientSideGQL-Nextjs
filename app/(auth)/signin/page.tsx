'use client'

import { SigninMutation } from '@/gql/signinMutation'
import { setToken } from '@/utils/token'
import { Button, Input } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { useMutation } from 'urql'

export default function SignInPage() {
  const [results, signin] = useMutation(SigninMutation)
  const router = useRouter()
  const [state, setState] = useState({ password: '', email: '' })

  const handleSignin = async (e: FormEvent) => {
    e.preventDefault()

    const data = await signin({ input: state })

    if (data.data?.signin) {
      setToken(data.data.signin.token)
      router.push('/')
    }
  }
  return (
    <div className="bg-white rounded-md border p-4 w-full shadow-md">
      <div className="text-2xl text-black/70">Sign in</div>
      <form onSubmit={handleSignin} className="flex flex-col gap-4 mt-4">
        <div>
          <Input
            value={state.email}
            onValueChange={(v) => setState((s) => ({ ...s, email: v }))}
            variant="faded"
            label="Email"
            classNames={{
              inputWrapper: 'bg-slate-50 border-slate-100',
            }}
          />
        </div>
        <div>
          <Input
            variant="faded"
            value={state.password}
            onValueChange={(v) => setState((s) => ({ ...s, password: v }))}
            label="Password"
            type="password"
            classNames={{ inputWrapper: 'bg-slate-50 border-slate-100' }}
          />
        </div>
        <div className="text-end">
          <Button type="submit" variant="solid" color="primary">
            Signin
          </Button>
        </div>
      </form>
    </div>
  )
}
