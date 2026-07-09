@echo off
set "TARGET_DIR=%~dp0"

set COUNT=0
for %%F in ("%TARGET_DIR%*.jpg" "%TARGET_DIR%*.jpeg") do (
    if exist "%%F" set /a COUNT+=1
)

if "%COUNT%"=="0" (
    echo No JPG files found in this folder.
    echo Folder: %TARGET_DIR%
    pause
    exit /b
)

echo Found %COUNT% JPG file^(s^) in:
echo %TARGET_DIR%
echo Converting to PNG ^(original JPG will be deleted after success^)...
echo.

set "PS1_FILE=%TEMP%\jpg_to_png_temp.ps1"

(
echo Add-Type -AssemblyName System.Drawing
echo $files = Get-ChildItem -LiteralPath "%TARGET_DIR%" -File ^| Where-Object { $_.Extension -in ".jpg", ".jpeg" }
echo foreach ^($f in $files^) {
echo     $newPath = [System.IO.Path]::ChangeExtension^($f.FullName, '.png'^)
echo     if ^(Test-Path -LiteralPath $newPath^) {
echo         Write-Host ^("Skip ^(PNG already exists^): " + [System.IO.Path]::GetFileName^($newPath^)^) -ForegroundColor Yellow
echo         continue
echo     }
echo     try {
echo         $img = [System.Drawing.Image]::FromFile^($f.FullName^)
echo         $bmp = New-Object System.Drawing.Bitmap $img
echo         $img.Dispose^(^)
echo         $bmp.Save^($newPath, [System.Drawing.Imaging.ImageFormat]::Png^)
echo         $bmp.Dispose^(^)
echo         Remove-Item -LiteralPath $f.FullName -Force
echo         Write-Host ^("OK: " + $f.Name + " -^> " + [System.IO.Path]::GetFileName^($newPath^) + " ^(original deleted^)"^)
echo     } catch {
echo         Write-Host ^("FAILED: " + $f.Name + " - " + $_.Exception.Message^) -ForegroundColor Red
echo     }
echo }
) > "%PS1_FILE%"

powershell -NoProfile -ExecutionPolicy Bypass -File "%PS1_FILE%"

del "%PS1_FILE%" >nul 2>&1

echo.
echo Done.
pause
