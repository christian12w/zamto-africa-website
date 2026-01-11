"""
Script to standardize all vehicle detail pages to match the reference design.
This script will check each vehicle page and update it if needed.
"""

import os
import re
from pathlib import Path

# Reference file
REFERENCE_FILE = "vehicle-toyota-alphard-2020-sale.html"

# Files to update
VEHICLE_FILES = [
    "vehicle-bmw-5-series-2014.html",
    "vehicle-bmw-x1-2011.html",
    "vehicle-haojue-eg150-2024.html",
    "vehicle-haojue-express125-2024.html",
    "vehicle-honda-fit-2009.html",
    "vehicle-honda-fit-2013.html",
    "vehicle-isuzu-mux-2018.html",
    "vehicle-isuzu-van-2018.html",
    "vehicle-legend-2023.html",
    "vehicle-lexus-rx-300t-2020.html",
    "vehicle-lexus-rx270-2015.html",
    "vehicle-mazda-cx-5-2012.html",
    "vehicle-mazda-cx-8-2020.html",
    "vehicle-mitsubishi-pajero-2011-pearl.html",
    "vehicle-mitsubishi-pajero-2012.html",
    "vehicle-mitsubishi-pajero-2014.html",
    "vehicle-nissan-juke-2012.html",
    "vehicle-prado-2014.html",
    "vehicle-prado-2015.html",
    "vehicle-prado-2017-white.html",
    "vehicle-prado-2017.html",
    "vehicle-subaru-forester-2019.html",
    "vehicle-subaru-forester-2025.html",
    "vehicle-t21-electric-2024.html",
    "vehicle-toyota-allion-2015.html",
    "vehicle-toyota-alphard-2015.html",
    "vehicle-toyota-alphard-2020.html",
    "vehicle-toyota-crown-2018.html",
    "vehicle-toyota-crown-2024.html",
    "vehicle-toyota-crown-athlete-2006.html",
    "vehicle-toyota-harrier-2016-black.html",
    "vehicle-toyota-hilux-2018-blue.html",
    "vehicle-toyota-hilux-2018.html",
    "vehicle-toyota-hilux-2020-white.html",
    "vehicle-toyota-hilux-2021.html",
    "vehicle-toyota-land-cruiser-prado-2017-black.html",
    "vehicle-toyota-land-cruiser-prado-2018-silver.html",
    "vehicle-toyota-land-cruiser-prado-2018-white.html",
    "vehicle-toyota-passo-2012.html",
    "vehicle-toyota-passo-blue-2012.html",
    "vehicle-toyota-passo-brown-2014.html",
    "vehicle-toyota-passo-hire.html",
    "vehicle-toyota-passo-yellow-2013.html",
    "vehicle-toyota-vellfire-2010-black.html",
    "vehicle-toyota-vellfire-2010-white.html",
    "vehicle-velfire-2010.html",
    "vehicle-velfire-2011.html",
    "vehicle-details.html",
]

def check_if_already_updated(filepath):
    """Check if a file already has the updated design."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            # Check for key indicators of the updated design
            has_breadcrumbs = 'Breadcrumbs' in content or 'breadcrumb' in content.lower()
            has_tabs = 'tab-btn' in content or 'showTab' in content
            has_modern_header = 'HEADER - Modern Standard Design' in content
            has_similar_vehicles = 'Similar Vehicles' in content
            
            return has_breadcrumbs and has_tabs and has_modern_header and has_similar_vehicles
    except Exception as e:
        print(f"Error checking {filepath}: {e}")
        return False

def main():
    script_dir = Path(__file__).parent
    
    print("Checking vehicle detail pages...")
    print("=" * 60)
    
    needs_update = []
    already_updated = []
    
    for filename in VEHICLE_FILES:
        filepath = script_dir / filename
        if not filepath.exists():
            print(f"[WARN] File not found: {filename}")
            continue
            
        if check_if_already_updated(filepath):
            already_updated.append(filename)
            print(f"[OK] Already updated: {filename}")
        else:
            needs_update.append(filename)
            print(f"[UPDATE] Needs update: {filename}")
    
    print("\n" + "=" * 60)
    print(f"\nSummary:")
    print(f"  Already updated: {len(already_updated)} files")
    print(f"  Needs update: {len(needs_update)} files")
    print(f"  Not found: {len(VEHICLE_FILES) - len(already_updated) - len(needs_update)} files")
    
    if needs_update:
        print(f"\n Files that need updating:")
        for filename in needs_update:
            print(f"  - {filename}")

if __name__ == "__main__":
    main()
