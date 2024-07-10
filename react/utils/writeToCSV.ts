/* eslint-disable @typescript-eslint/no-explicit-any */
import * as XLSX from 'xlsx'

function writeToCSV(items: any[], fileName: string) {
  const ws = XLSX.utils.json_to_sheet(items)
  const wb = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(wb, ws, 'Mega Menu')
  const exportFileName = fileName

  XLSX.writeFile(wb, exportFileName)
}

export default writeToCSV
