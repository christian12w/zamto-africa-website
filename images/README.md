# Vehicle Images Directory

## Structure
```
images/
├── vehicles/
│   ├── white-landcruiser-1.jpg  # Main featured image (Front View)
│   ├── white-landcruiser-2.jpg  # Side View
│   ├── white-landcruiser-3.jpg  # Rear View
│   ├── white-landcruiser-4.jpg  # Interior
│   └── white-landcruiser-5.jpg  # Dashboard
└── README.md
```

## Usage

### Home Page Featured Vehicle
- **File:** `white-landcruiser-1.jpg`
- **Location:** Home page featured vehicles section
- **Path:** `images/vehicles/white-landcruiser-1.jpg`

### Vehicle Details Page
- **Main Image:** `white-landcruiser-1.jpg` (Front View)
- **Thumbnails:** `white-landcruiser-2.jpg` through `white-landcruiser-5.jpg`
- **Path:** `images/vehicles/[filename]`

## Image Descriptions
1. **white-landcruiser-1.jpg** - Front exterior view
2. **white-landcruiser-2.jpg** - Side exterior view
3. **white-landcruiser-3.jpg** - Rear exterior view
4. **white-landcruiser-4.jpg** - Interior seating
5. **white-landcruiser-5.jpg** - Dashboard and controls

## Technical Notes
- All images use `object-cover` for proper aspect ratio
- Hover effects applied with `image-gallery` class
- Alt text provided for accessibility
- Responsive sizing maintained across devices

## Adding New Vehicles
1. Create new folder under `images/vehicles/` if needed
2. Follow naming convention: `[color]-[make]-[model]-[number].jpg`
3. Update corresponding HTML files with new paths
4. Add alt text descriptions for accessibility
