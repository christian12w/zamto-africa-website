"""
Simplified script to restore original vehicle data with modern design.
No external dependencies required.
"""

import os
import re
from pathlib import Path

# Files to restore
FILES_TO_FIX = [
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

def read_file(filepath):
    """Read file content."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return None

def write_file(filepath, content):
    """Write content to file."""
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    except Exception as e:
        print(f"Error writing {filepath}: {e}")
        return False

def extract_header_footer_from_reference():
    """Extract modern header and footer from reference file."""
    script_dir = Path(__file__).parent
    ref_path = script_dir / "vehicle-toyota-alphard-2020-sale.html"
    
    content = read_file(ref_path)
    if not content:
        return None, None, None
    
    # Extract everything from start to end of </div> after Mobile Menu
    # This includes <head>, header, and mobile menu
    header_end = content.find('</div>\n  </div>\n\n    <!-- Breadcrumbs -->')
    if header_end == -1:
        header_end = content.find('<!-- Breadcrumbs -->')
    
    header = content[:header_end + len('</div>\n  </div>\n')] if header_end != -1 else None
    
    # Extract footer (from <!-- FOOTER to end)
    footer_start = content.find('  <!-- FOOTER')
    footer = content[footer_start:] if footer_start != -1 else None
    
    return header, footer

def restore_file(backup_path, output_path):
    """Restore a file with original content but modern header/footer."""
    
    # Read backup (original)
    original = read_file(backup_path)
    if not original:
        return False
    
    # Read reference for modern design
    script_dir = Path(__file__).parent
    ref_path = script_dir / "vehicle-toyota-alphard-2020-sale.html"
    reference = read_file(ref_path)
    if not reference:
        return False
    
    # Extract title and description from original
    title_match = re.search(r'<title>(.*?)</title>', original, re.DOTALL | re.IGNORECASE)
    orig_title = title_match.group(1) if title_match else "Vehicle Details"
    
    desc_match = re.search(r'<meta name="description" content="(.*?)"', original, re.IGNORECASE)
    orig_desc = desc_match.group(1) if desc_match else ""
    
    # Extract main content from original (between </header> and <footer or <!-- Footer)
    content_start = original.find('</header>')
    if content_start == -1:
        content_start = original.find('</nav>')
    
    content_end = original.find('<!-- Footer')
    if content_end == -1:
        content_end = original.find('<footer')
    
    if content_start == -1 or content_end == -1:
        print(f"    Could not find content boundaries")
        return False
    
    original_content = original[content_start:content_end]
    
    # Get modern header/footer from reference
    ref_header_end = reference.find('</div>\n  </div>\n\n    <!-- Breadcrumbs -->')
    ref_footer_start = reference.find('  <!-- FOOTER')
    
    if ref_header_end == -1 or ref_footer_start == -1:
        print(f"    Could not extract reference design")
        return False
    
    modern_header = reference[:ref_header_end + len('</div>\n  </div>\n')]
    modern_footer = reference[ref_footer_start:]
    
    # Update header with original title and description
    modern_header = re.sub(
        r'<title>.*?</title>',
        f'<title>{orig_title}</title>',
        modern_header,
        flags=re.DOTALL | re.IGNORECASE
    )
    modern_header = re.sub(
        r'<meta name="description" content=".*?"',
        f'<meta name="description" content="{orig_desc}"',
        modern_header,
        flags=re.IGNORECASE
    )
    
    # Combine: modern header + original content + modern footer
    new_content = modern_header + "\n" + original_content + "\n" + modern_footer
    
    return write_file(output_path, new_content)

def main():
    script_dir = Path(__file__).parent
    backup_dir = script_dir / "backups"
    
    print("=" * 70)
    print("RESTORING ORIGINAL VEHICLE DATA WITH MODERN DESIGN")
    print("=" * 70)
    print("\nThis will restore ALL original vehicle details")
    print("while keeping the modern header/footer design.")
    print("\n" + "=" * 70)
    
    success = 0
    failed = 0
    
    print(f"\nProcessing {len(FILES_TO_FIX)} files...\n")
    
    for filename in FILES_TO_FIX:
        # Find backup
        backup_files = list(backup_dir.glob(f"{Path(filename).stem}_backup_*.html"))
        
        if not backup_files:
            print(f"[SKIP] {filename} - No backup found")
            failed += 1
            continue
        
        backup_path = backup_files[0]
        output_path = script_dir / filename
        
        print(f"Processing: {filename}")
        print(f"  Restoring from: {backup_path.name}...", end=" ")
        
        if restore_file(backup_path, output_path):
            print("[OK]")
            success += 1
        else:
            print("[FAILED]")
            failed += 1
    
    print("\n" + "=" * 70)
    print("RESTORATION COMPLETE")
    print("=" * 70)
    print(f"\nSuccessfully restored: {success} files")
    print(f"Failed: {failed} files")
    print("\nAll vehicle-specific data has been preserved!")
    print("=" * 70)

if __name__ == "__main__":
    main()
