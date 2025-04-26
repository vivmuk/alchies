# App Icon Processing Instructions

Follow these steps to convert the Aubrey headshot image into app icons:

## Required Icon Sizes
1. **favicon.ico**: 16x16, 32x32, 48x48, and 64x64
2. **aubrey-icon-192.png**: 192x192 pixels
3. **aubrey-icon-512.png**: 512x512 pixels

## Processing Steps

### Option 1: Online Tool
1. Go to a favicon generator like [favicon.io](https://favicon.io/) or [realfavicongenerator.net](https://realfavicongenerator.net/)
2. Upload the Aubrey headshot image
3. Generate the icons
4. Download and place the following files in the `public` folder:
   - favicon.ico
   - aubrey-icon-192.png
   - aubrey-icon-512.png

### Option 2: Using Image Editing Software
1. Open the Aubrey headshot image in an image editor (Photoshop, GIMP, etc.)
2. Crop the image to a square aspect ratio
3. Resize to create:
   - 192×192 pixel PNG image named "aubrey-icon-192.png"
   - 512×512 pixel PNG image named "aubrey-icon-512.png"
4. For favicon.ico, create a multi-resolution ICO file with 16x16, 32x32, 48x48, and 64x64 px

### Tips for Best Results
- Ensure the image is centered with some padding around the face
- Save in PNG format with transparency for the PNG files
- The app manifest and HTML files have already been updated to use these filenames

After generating and saving these files to the public folder, the web app will use Aubrey's image as the app icon when installed on mobile devices. 