# images

You'll need to download [AssetStudioCLI](https://gitlab.com/RazTools/Studio/-/releases). Choose either net7.0 or net6.0 depending on what net version you have installed.

Extract your AssetStudioCLI to some location.

Open up your command prompt and navigate to the location you've extracted AssetStudioCLI to.

The following is an example command you can use:

`AssetStudioCLI.exe "D:\StarRail\Windows" "D:\StarRail\output" --silent --types "Texture2D,Sprite" --game SR`

The first parameter is the path to the folder containing the blk files. Likely similar to: `C:\Program Files\Star Rail\Games\StarRail_Data\StreamingAssets\Asb\Windows`.

The second paramater is the path where you want to output all the files to.

`D:\StarRail\AssetStudioCLI\AssetStudioCLI.exe "C:\Program Files\Star Rail\Games\StarRail_Data\StreamingAssets\Asb\Windows" "D:\StarRail\0520" --silent --types "Texture2d" --group_assets "ByContainer" --game "SR"`