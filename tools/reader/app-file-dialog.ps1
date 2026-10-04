param([Parameter(Mandatory)][string]$FilePath, [ValidateSet('Any','Save','Open')][string]$ExpectedAction = 'Any')
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName UIAutomationClient
Add-Type -AssemblyName UIAutomationTypes
$process = Get-Process dehelper -ErrorAction Stop | Select-Object -First 1
$windows = [System.Windows.Automation.AutomationElement]::RootElement.FindAll(
  [System.Windows.Automation.TreeScope]::Children,
  [System.Windows.Automation.PropertyCondition]::new([System.Windows.Automation.AutomationElement]::ProcessIdProperty, $process.Id))
$dialog = $null
foreach ($window in $windows) {
  if ($window.Current.ClassName -eq '#32770') { $dialog = $window; break }
  $dialog = $window.FindFirst([System.Windows.Automation.TreeScope]::Descendants,
    [System.Windows.Automation.PropertyCondition]::new([System.Windows.Automation.AutomationElement]::ClassNameProperty, '#32770'))
  if ($dialog) { break }
}
if (-not $dialog) { throw '尚未出现德语助手的文件对话框' }
if ($ExpectedAction -eq 'Save' -and $dialog.Current.Name -notmatch '保存|另存|Save') { throw '当前不是保存对话框' }
if ($ExpectedAction -eq 'Open' -and $dialog.Current.Name -notmatch '打开|Open') { throw '当前不是打开对话框' }
$edit = $dialog.FindFirst([System.Windows.Automation.TreeScope]::Descendants,
  [System.Windows.Automation.AndCondition]::new(
    [System.Windows.Automation.PropertyCondition]::new([System.Windows.Automation.AutomationElement]::ControlTypeProperty, [System.Windows.Automation.ControlType]::Edit),
    [System.Windows.Automation.PropertyCondition]::new([System.Windows.Automation.AutomationElement]::AutomationIdProperty, '1148')))
if (-not $edit) {
  $fileNameHost = $dialog.FindFirst([System.Windows.Automation.TreeScope]::Descendants,
    [System.Windows.Automation.PropertyCondition]::new([System.Windows.Automation.AutomationElement]::AutomationIdProperty, 'FileNameControlHost'))
  if ($fileNameHost) {
    $edit = $fileNameHost.FindFirst([System.Windows.Automation.TreeScope]::Descendants,
      [System.Windows.Automation.PropertyCondition]::new([System.Windows.Automation.AutomationElement]::ClassNameProperty, 'Edit'))
  }
}
if (-not $edit) { throw '文件对话框中没有预期的文件名输入框' }
$absolute = [System.IO.Path]::GetFullPath($FilePath)
if ($dialog.Current.Name -match '保存|Save' -and (Test-Path -LiteralPath $absolute)) {
  throw '目标导出文件已存在，请换一个文件名以保留已有文件'
}
$valuePattern = [System.Windows.Automation.ValuePattern]$edit.GetCurrentPattern([System.Windows.Automation.ValuePattern]::Pattern)
$valuePattern.SetValue($absolute)
if ($valuePattern.Current.Value -ne $absolute) { throw '文件名输入未成功，请保留对话框检查' }
$button = $dialog.FindAll([System.Windows.Automation.TreeScope]::Descendants,
  [System.Windows.Automation.PropertyCondition]::new([System.Windows.Automation.AutomationElement]::AutomationIdProperty, '1')) |
  Where-Object { $_.Current.Name -match '^(保存|打开|Save|Open)' } | Select-Object -First 1
if (-not $button) { throw '未找到打开或保存按钮' }
([System.Windows.Automation.InvokePattern]$button.GetCurrentPattern([System.Windows.Automation.InvokePattern]::Pattern)).Invoke()
Write-Output ('已提交文件对话框：' + [System.IO.Path]::GetFileName($absolute))
