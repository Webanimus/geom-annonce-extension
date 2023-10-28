# Geom Annonce Chrome Extension

## Description

Geom Annonce is a Chrome Extension designed to help you find the exact address of real estate listings on supported websites. Stop wasting your time with vague descriptions and get the information you need at your fingertips.

More infos on [GeomServices.com](https://geomservices.com).

## Features

- Automatic location retrieval for real estate listings
- Supports multiple websites
  - leboncoin.fr
  - seloger.com

## Installation

1. Download the source code from the repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Toggle on "Developer mode" at the top right corner.
4. Click "Load unpacked" and select the extension directory.

## Usage

1. Once installed, you'll see the Geom Annonce icon in the Chrome toolbar.
2. Navigate to a supported website and open a real estate listing.
3. Click on the Geom Annonce icon to reveal the exact address (if available).

## File Structure

- `manifest.json`: Extension configuration and metadata
- `background.js`: Background service worker script
- `popup.html`: HTML content for the popup
- `content.js`: Content script that interacts with supported web pages
- `env.js`: Environment configurations
- `axios.min.js`: Axios library for making HTTP requests
- `icon.png`: Extension icon (128x128)

## Permissions

- `tabs`: To interact with the Chrome tabs
- `activeTab`: To access and modify the content of the active tab

## Contributing

Contributions are welcome. Please submit a pull request or create an issue to discuss proposed changes.

## License

This project is licensed under the MIT License.
