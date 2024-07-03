import { gql } from 'urql'

export const EditIssueMutation = gql`
  mutation EditIssue($input: EditIssueInput!) {
    editIssue(input: $input) {
      id
      name
      status
      createdAt
    }
  }
`
