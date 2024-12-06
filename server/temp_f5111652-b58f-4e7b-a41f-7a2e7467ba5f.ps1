# Define the path to the Downloads folder
$downloadsPath = [environment]::GetFolderPath("UserProfile") + "\Downloads"

# Define the name of the new folder
$newFolderName = "test 2"

# Combine the paths
$newFolderPath = Join-Path -Path $downloadsPath -ChildPath $newFolderName

# Create the folder if it doesn't already exist
if (-not (Test-Path -Path $newFolderPath)) {
    New-Item -ItemType Directory -Path $newFolderPath
    Write-Host "Folder 'test 2' created in Downloads."
} else {
    Write-Host "Folder 'test 2' already exists in Downloads."
}
