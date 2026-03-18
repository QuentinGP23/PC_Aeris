import './Table.scss'
import type { ReactNode } from 'react'

interface TableProps {
  children: ReactNode
  striped?: boolean
  hoverable?: boolean
  compact?: boolean
  className?: string
}

function Table({ children, striped = false, hoverable = true, compact = false, className = '' }: TableProps) {
  return (
    <div className="table-wrapper">
      <table className={`table ${className}`} data-striped={striped} data-hoverable={hoverable} data-compact={compact}>
        {children}
      </table>
    </div>
  )
}

function Thead({ children }: { children: ReactNode }) { return <thead className="table__head">{children}</thead> }
function Tbody({ children }: { children: ReactNode }) { return <tbody className="table__body">{children}</tbody> }
function Tr({ children, className = '' }: { children: ReactNode; className?: string }) { return <tr className={`table__row ${className}`}>{children}</tr> }
function Th({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) { return <th className={`table__th ${className}`} onClick={onClick}>{children}</th> }
function Td({ children, className = '' }: { children: ReactNode; className?: string }) { return <td className={`table__td ${className}`}>{children}</td> }

Table.Head = Thead
Table.Body = Tbody
Table.Row = Tr
Table.Th = Th
Table.Td = Td

export default Table
