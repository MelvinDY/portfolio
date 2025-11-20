# Project Images

This folder contains images for each project in the portfolio.

## Folder Structure

Each project has its own subfolder named after the project ID:
- `onlycode/` - OnlyCode project images
- `ratemyaccom/` - RateMyAccom project images
- `ignite/` - PPIA UNSW Ignite project images
- `stall-wars/` - Stall Wars project images
- `portfolio/` - Portfolio Website project images
- `capstone-project/` - UNSW Capstone Project images

## Adding Images

1. **Navigate to the project folder** corresponding to your project ID
2. **Add your images** with descriptive names (e.g., `screenshot-1.png`, `feature-demo.jpg`)
3. **Update the project data** in `src/app/data/projects.ts` to include the image paths

## Image Naming Convention

- Use lowercase letters and hyphens for filenames
- Use descriptive names (e.g., `homepage-view.png`, `mobile-interface.jpg`)
- Number images if showing a sequence (e.g., `1.png`, `2.png`, `3.png`)

## Supported Formats

- PNG (.png)
- JPEG/JPG (.jpg, .jpeg)
- WebP (.webp)
- GIF (.gif)

## Example

For the "onlycode" project, add images to `public/projects/onlycode/`:
```
public/projects/onlycode/
  ├── 1.png
  ├── 2.png
  └── 3.png
```

Then update `src/app/data/projects.ts`:
```typescript
{
  id: "onlycode",
  title: "OnlyCode",
  images: [
    "/projects/onlycode/1.png",
    "/projects/onlycode/2.png",
    "/projects/onlycode/3.png"
  ],
  // ... other fields
}
```

## Features

- **Auto-transition**: Images will automatically transition every 3 seconds
- **Manual navigation**: Click left/right arrows to manually navigate
- **Modal view**: Click any project card to view images in a full-screen modal
- **Keyboard support**: Use arrow keys to navigate in modal view
