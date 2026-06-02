$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
try {
    $wb = $excel.Workbooks.Open("F:\Pendrive King\bMis\Finanse\Baza Danych 24-08-2018.xls")
    $ws = $wb.Sheets.Item(1)
    
    # Get first 5 rows to be sure
    Write-Host "--- XLS Header (First 5 rows) ---"
    for ($r = 1; $r -le 5; $r++) {
        $rowStr = ""
        for ($c = 1; $c -le 20; $c++) {
            $val = $ws.Cells.Item($r, $c).Text
            $rowStr += "[$val] "
        }
        Write-Host $rowStr
    }
    
    $wb.Close($false)
} catch {
    Write-Error $_
} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
