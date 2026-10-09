# TIFF Viewer – Marketplace Documentation

Widget version 1.1.0 · Mendix Studio Pro 10.24.17 · Web

## Industry

All industries (cross-industry).

## Categories

- Widgets
- User Interface / Display

## Component tagline

View multi-page TIFF images page by page, with page buttons, zoom and print.

(76 characters)

## About

Browsers cannot show TIFF images in an image widget. TIFF Viewer decodes a TIFF file in the browser and shows it one page at a time. Multi-page files get Previous and Next buttons with the page number, and optional buttons let users zoom in and out and print all pages of the file. No server-side conversion is needed.

The image is an image property, like in the Mendix Image widget: a dynamic image (an object of System.Image or a specialization, from the data view) or a static image. The page buttons (below, above or as arrows next to the page), their color and language (en, de, fr, es, tr, ja, zh, ru, ar, hi), and the zoom and print buttons can be set with attributes, so they can change at run time.

Use cases:
- Scanned documents such as delivery notes, invoices, contracts and forms that are stored as images.
- Faxes, which are usually stored as multi-page TIFF files.
- Technical drawings, plans and archive images in TIFF format.
- Reviewing and printing an uploaded TIFF file before it is processed or approved.

Version 1.1.0 is rebuilt for Mendix Studio Pro 10.24.17 without the react-tiff library. Print now prints only the TIFF pages instead of the whole Mendix page, zoom works, the top and ltr page buttons work, ten languages are supported, a new Height property sets the size, and clear error messages replace the empty box of 1.0.0. The package is about 100 KB (1.0.0: about 2 MB per bundle).

The source code is on GitHub: https://github.com/bharathidas/TiffViewer

## Typical usage scenario

TIFF Viewer is for apps that store documents or images as TIFF files (System.Image objects) and need to show and print them on a page without a download or a conversion on the server. Users see one page at a time, move through multi-page files with Previous and Next, zoom in on details and print all pages.

- Scanned documents such as delivery notes, invoices, contracts and forms.
- Faxes, which are usually stored as multi-page TIFF files.
- Technical drawings, plans and archive images in TIFF format.
- Reviewing and printing an uploaded TIFF file before it is processed or approved.

## Features and limitations

**Features**

- Shows single and multi-page TIFF files one page at a time; reduced-resolution thumbnails inside the file are skipped.
- Page buttons below the page (Previous, Page 1 of n, Next), above the page, or as arrows left and right of the page.
- Zoom in and Zoom out (1.25x per step, up to 5x); the page scrolls when it is larger than the viewer.
- Print prints all pages of the file, each on its own sheet, without the rest of the Mendix page.
- Button texts in English, German, French, Spanish, Turkish, Japanese, Chinese, Russian, Arabic and Hindi.
- Button color, Height (any CSS unit; default 600px) and show/hide of the zoom and print buttons.
- Supports the common TIFF compressions: none, LZW, PackBits, Deflate, CCITT fax G3/G4 and JPEG.
- Pages are fitted to the viewer and fitted again when the viewer changes size.
- Clear messages while loading and when the file is not a TIFF image or cannot be loaded (with the HTTP status).
- Class and style from Studio Pro, and CSS classes for the toolbar, buttons, pages and messages.
- Offline capable.

**Limitations**

- Web only; not available for native mobile.
- The whole file is loaded and decoded in the browser, so very large files take time and memory.
- One page is shown at a time; there is no thumbnail list or rotation.
- Page buttons, button color, language and the zoom and print options are attributes, not fixed values in the widget properties.
- The loading and error messages are in English.
- Studio Pro design mode shows a placeholder, because a dynamic image is only known at run time.

## Dependencies

- Mendix Studio Pro 10.24.17 or a later 10.24 version.
- No other modules or libraries are needed.

## Installation

1. Download `mxtechies.TiffViewer.mpk` from the Marketplace (or from the GitHub release Version1.1.0).
2. Copy it into the `widgets` folder of your app (App > Show App Directory in Explorer).
3. In Studio Pro, press F4 (App > Synchronize App Directory).
4. The widget appears in the Toolbox as **TIFF Viewer** (category Display).

**Upgrading from 1.0.0:** replace the file in the `widgets` folder and press F4. Studio Pro reports that the widget definition changed; right-click the error and choose **Update all widgets**. Your settings are kept and the new Height property gets 600px. If the running app still shows the old widget, choose App > Clean Deployment Directory and run the app again. Without a Button color attribute the page buttons are now #c53030 (1.0.0: grey); if Page buttons is `top`, the buttons now appear above the page (1.0.0 showed no buttons).

## Configuration

1. Create an entity that specializes **System.Image**, for example `ScannedDocument`, or use an existing one. Let users upload TIFF files (allow the extensions .tif and .tiff).
2. Put a data view of that entity on the page.
3. Drag **TIFF Viewer** into the data view and set **TIFF image** to the dynamic image of the data view object.
4. Optionally set **Height**, and select attributes for **Page buttons** (bottom, top or ltr), **Button color**, **Language** (String), **Show zoom buttons** and **Show print button** (Boolean). Without them the viewer is 600px high with red page buttons below the page, English texts, and zoom and print buttons.

Recommended settings:

- Document review on a detail page: Height 700px, Page buttons bottom, zoom and print shown.
- Compact preview in a card: Height 320, Page buttons ltr, Show zoom buttons and Show print button false.
- Full-screen review in a pop-up: Height 80vh, Page buttons top.
- Users in another language: a Language attribute filled from the user's language, for example de or fr-FR.
- Phone: Height 70vh, Page buttons top.

The user needs read access to the image object; otherwise the widget shows the HTTP status (401 or 404).

Styling: the outer element has the class `widget-tiffviewer`, the toolbar `widget-tiffviewer-toolbar`, each page `widget-tiffviewer-page`, the page buttons `widget-tiffviewer-page-button` (or `widget-tiffviewer-arrow` for ltr) and error messages `widget-tiffviewer-error`.

## Known bugs

- None known in version 1.1.0.
- Known behaviour: small images are enlarged to fit the viewer.
- Report bugs on GitHub: https://github.com/bharathidas/TiffViewer/issues

## FAQ

**Why does the widget show "The file is not a valid TIFF image."?**
The image object holds another file type (for example a PNG or PDF). TIFF Viewer only shows TIFF files; use the Mendix Image widget for other images.

**Why does Print print the whole page in my old version?**
That is version 1.0.0. In 1.1.0 Print prints only the pages of the TIFF file, every page on its own sheet.

**How do I put the page buttons above the page or next to it?**
Select a String attribute for Page buttons with the value top (above) or ltr (arrows left and right of the page).

**How do I show the buttons in another language?**
Select a String attribute for Language with en, de, fr, es, tr, ja, zh, ru, ar or hi. A code such as de-DE is read as de.

**How do I hide the zoom or print buttons?**
Select a Boolean attribute for Show zoom buttons or Show print button and set it to false. Without an attribute the buttons are shown.

**Does it work in older Mendix versions?**
Version 1.1.0 is built and tested for Studio Pro 10.24.17. Version 1.0.0 (GitHub release V1.0.0) was made for Mendix 10.18.3.
