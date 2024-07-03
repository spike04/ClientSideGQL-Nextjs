import { gql } from 'urql'

export const SigninMutation = gql`
  mutation Signin($input: AuthInput!) {
    signin(input: $input) {
      token
    }
  }
`
