# Gradient Wallpaper Generator

This project is a **React-based web app** that allows users to upload an image and automatically extracts dominant colors from it. The app then generates a beautiful **blended gradient wallpaper** based on those colors, which users can apply to their screens.

## Key Features:
- **Image Upload**: Users can upload an image (JPG, PNG, etc.) directly from their device.
- **Color Extraction**: The app analyzes the image to extract prominent colors using a color-extraction algorithm.
- **Gradient Creation**: Once the dominant colors are extracted, the app creates a **dynamic gradient wallpaper**.
- **Dark/Light Mode Toggle**: The app supports both dark and light themes, allowing users to toggle between them for a comfortable browsing experience.
- **Responsive Design**: The app is mobile-friendly, ensuring it works on various screen sizes and devices.

## Technologies Used:
- **React**: For building the user interface and app components.
- **Styled-components**: For creating a styled and responsive layout.
- **React-dropzone**: For handling image uploads.
- **React-color-extractor**: For extracting colors from images.
- **LocalStorage**: For saving theme preferences and providing a personalized experience.

## How It Works:
1. Users upload an image using the drag-and-drop upload zone.
2. The app processes the image to extract key colors using **React-color-extractor**.
3. The extracted colors are used to generate a **blended gradient background**.
4. Users can toggle between light and dark themes, which dynamically adjust the app's color scheme.
5. The app offers a simple and intuitive interface for creating stunning gradients directly from images.
