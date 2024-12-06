# Define the path to the Downloads folder and the new folder name
$DownloadsPath = [Environment]::GetFolderPath("UserProfile") + "\Downloads"
$NewFolderPath = Join-Path -Path $DownloadsPath -ChildPath "Test1"

# Create the folder if it doesn't already exist
if (-Not (Test-Path -Path $NewFolderPath)) {
    New-Item -Path $NewFolderPath -ItemType Directory
    Write-Output "Folder 'Test1' created successfully in Downloads."
} else {
    Write-Output "Folder 'Test1' already exists in Downloads."
}
