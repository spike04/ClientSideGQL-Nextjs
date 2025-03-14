'use client'

import StatusRing from '@/components/StatusRing'
import { EditIssueMutation } from '@/gql/updateIssueMutation'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react'
import { useMutation } from 'urql'

export default function Status({
  status,
  issueId,
}: {
  status: string
  issueId: string
}) {
  const [{ error, data, fetching }, editIssue] = useMutation(EditIssueMutation)

  const onAction = async (newStatus: string) => {
    await editIssue({ input: { id: issueId, status: newStatus } })
  }

  return (
    <Dropdown
      classNames={{
        content: 'p-0 border-small border-divider bg-background',
      }}
    >
      <DropdownTrigger>
        <button className="active:outline-none outline-none">
          <StatusRing status={status} />
        </button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Statuses"
        className="p-3"
        selectionMode="single"
        selectedKeys={[status]}
        onAction={(value) => onAction(value as string)}
        itemClasses={{
          base: [
            'rounded-md',
            'text-default-500',
            'transition-opacity',
            'data-[hover=true]:text-foreground',
            'data-[hover=true]:bg-default-100',
            'dark:data-[hover=true]:bg-default-50',
            'data-[selectable=true]:focus:bg-default-50',
            'data-[pressed=true]:opacity-70',
            'data-[focus-visible=true]:ring-default-500',
          ],
        }}
      >
        <DropdownItem
          key="BACKLOG"
          startContent={<StatusRing status={'BACKLOG'} />}
        >
          <span>Backlog</span>
        </DropdownItem>
        <DropdownItem
          key="INPROGRESS"
          startContent={<StatusRing status={'INPROGRESS'} />}
        >
          <span>In Progress</span>
        </DropdownItem>
        <DropdownItem key="DONE" startContent={<StatusRing status={'DONE'} />}>
          <span>Done</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
