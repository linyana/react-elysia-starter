import {
  hasAllPermissions,
} from '@/utils'
import type {
  IColumnsType,
} from './types'
import {
  useGlobal,
} from '@/hooks'

export const useColumns = <T>({
  columns,
}: {
  columns: IColumnsType<T>,
}) => {
  const global = useGlobal()

  const {
    permissions = [],
  } = global

  return columns.filter((column) => (
    hasAllPermissions(permissions, column.permissions || [])
  ))
}