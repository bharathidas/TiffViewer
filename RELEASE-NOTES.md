TIFF Viewer 1.1.0 for **Mendix Studio Pro 10.24.17** (web).

## Compatibility
- Mendix Studio Pro 10.24.17 or a later 10.24 version, web profiles only.
- Built with `@mendix/pluggable-widgets-tools` 10.16.0 and React 18. The TIFF files are decoded with utif2 4.1.0.
- The package is about 100 KB. 1.0.0 was about 2 MB per bundle (react-tiff with axios and i18next).
- The widget ID (`mxtechies.tiffviewer.TiffViewer`) and property keys are the same as in 1.0.0, so existing pages keep their settings.

## Changes and fixes
- The viewer is rebuilt without the react-tiff library. It looks and works as before (one page at a time, Previous/Next, zoom, print, languages and button color), with these fixes:
- **Print** prints only the pages of the TIFF file, every page on its own sheet. In 1.0.0 it printed the whole Mendix page.
- **Zoom** in and out work in steps of 1.25x, from the fitted size up to 5x; the page scrolls when it is larger than the viewer. In 1.0.0 the zoom buttons were covered by the page layout so they could not be clicked, and Zoom out stopped working after zooming in.
- **Page buttons** `top` and `ltr` work, and the value ignores case and spaces. In 1.0.0 `top` hid the page buttons and `ltr` (the value in the Studio Pro description) showed them at the bottom.
- **Language**: en, de, fr, es, tr, ja, zh, ru, ar and hi; `fr-FR` is read as `fr`, and the zoom and print buttons are translated too. 1.0.0 knew five languages and needed an exact match.
- **New Height** property (default 600px; a number without a unit is read as pixels). 1.0.0 was always 600px high.
- The page is fitted to the viewer and fitted again when the viewer changes size.
- Files from another server load when that server allows CORS, whatever content type it sends. 1.0.0 showed nothing when the content type did not contain "tiff".
- When the image changes (for example another object in the data view), the new file is shown. The react-tiff viewer of 1.0.0 kept showing the first file.
- Clear error messages: "The file is not a valid TIFF image." and the HTTP status (for example 404) when the file cannot be loaded. 1.0.0 showed an empty box.
- Reduced-resolution thumbnails stored in a TIFF are no longer shown as an extra page.
- Without a Button color the page buttons are #c53030, the color in the example of the description (1.0.0 showed plain grey buttons).
- The class and style set in Studio Pro are applied.
- No messages in the browser console.
- Studio Pro design mode shows a placeholder instead of an empty box. Clearer captions and descriptions.

Tested in a Mendix 10.24.17 app (35 automated checks; 1.0.0 fails 15 of them): page buttons (bottom, top, ltr), Previous/Next, languages, button color, zoom in and out, print, the zoom and print attributes, the Height property, thumbnails, a 2400x3200 page, a non-TIFF file, a missing file, a file on another server, class and style, and a phone-sized window.

## Install
1. Download `mxtechies.TiffViewer.mpk` below.
2. Copy it into the `widgets` folder of your app and press **F4** (App > Synchronize App Directory).
3. Place **TIFF Viewer** in a data view of an entity that is (or specializes) System.Image and select that image for **TIFF image**.

## Upgrade from 1.0.0
1. Replace the old `mxtechies.TiffViewer.mpk` in the `widgets` folder and press **F4**.
2. Studio Pro reports that the widget definition changed. Right-click the error and choose **Update all widgets**. Your settings are kept; the new Height property gets 600px.
3. If the running app still shows the old widget, stop it, choose **App > Clean Deployment Directory** and run it again.

Check after upgrading: the page buttons are #c53030 when no Button color attribute is set (1.0.0: grey). If you set Page buttons to `top`, the buttons now appear above the page (1.0.0 showed no buttons).
