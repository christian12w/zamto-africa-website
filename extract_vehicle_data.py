"""
Script to update vehicle detail pages to match the reference design.
This script extracts vehicle-specific data and applies the standard template.
"""

import os
import re
from pathlib import Path
from bs4 import BeautifulSoup

# Files that need updating (from our check script)
FILES_TO_UPDATE = [
    "vehicle-bmw-5-series-2014.html",
    "vehicle-haojue-eg150-2024.html",
    "vehicle-haojue-express125-2024.html",
    "vehicle-isuzu-van-2018.html",
    "vehicle-lexus-rx-300t-2020.html",
    "vehicle-lexus-rx270-2015.html",
    "vehicle-mitsubishi-pajero-2011-pearl.html",
    "vehicle-mitsubishi-pajero-2012.html",
    "vehicle-mitsubishi-pajero-2014.html",
    "vehicle-nissan-juke-2012.html",
    "vehicle-prado-2017-white.html",
    "vehicle-subaru-forester-2019.html",
    "vehicle-subaru-forester-2025.html",
    "vehicle-t21-electric-2024.html",
    "vehicle-toyota-allion-2015.html",
    "vehicle-toyota-alphard-2015.html",
    "vehicle-toyota-crown-2018.html",
    "vehicle-toyota-crown-2024.html",
    "vehicle-toyota-crown-athlete-2006.html",
    "vehicle-toyota-harrier-2016-black.html",
    "vehicle-toyota-hilux-2018-blue.html",
    "vehicle-toyota-hilux-2020-white.html",
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
    "vehicle-velfire-2011.html",
    "vehicle-details.html",
]

def extract_vehicle_data(filepath):
    """Extract vehicle-specific data from an HTML file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            soup = BeautifulSoup(content, 'html.parser')
            
            # Extract title
            title_tag = soup.find('title')
            title = title_tag.text if title_tag else "Vehicle Details"
            
            # Extract meta description
            meta_desc = soup.find('meta', {'name': 'description'})
            description = meta_desc['content'] if meta_desc and 'content' in meta_desc.attrs else ""
            
            # Try to extract vehicle name from title or h1
            h1_tag = soup.find('h1')
            vehicle_name = h1_tag.text.strip() if h1_tag else title.split('-')[0].strip()
            
            print(f"Extracted data from {os.path.basename(filepath)}:")
            print(f"  Title: {title[:60]}...")
            print(f"  Vehicle: {vehicle_name}")
            
            return {
                'title': title,
                'description': description,
                'vehicle_name': vehicle_name,
                'filepath': filepath
            }
    except Exception as e:
        print(f"Error extracting data from {filepath}: {e}")
        return None

def main():
    script_dir = Path(__file__).parent
    
    print("Extracting vehicle data from files that need updating...")
    print("=" * 60)
    
    vehicle_data_list = []
    
    for filename in FILES_TO_UPDATE[:5]:  # Process first 5 for testing
        filepath = script_dir / filename
        if filepath.exists():
            data = extract_vehicle_data(filepath)
            if data:
                vehicle_data_list.append(data)
        else:
            print(f"[WARN] File not found: {filename}")
    
    print("\n" + "=" * 60)
    print(f"\nExtracted data from {len(vehicle_data_list)} files")
    print("\nNote: This is a test run. Full update would process all 34 files.")

if __name__ == "__main__":
    main()
