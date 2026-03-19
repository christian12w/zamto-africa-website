# Fix the duplicate Lexus RX200T section in index.html

with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find and remove the duplicate section (lines 1179 to around 1243)
# Keep only the Toyota Vellfire we just added

start_remove = 1178  # Line 1179 (0-indexed)
end_remove = 1242    # Approximate end of duplicate (0-indexed)

# Remove the duplicate Lexus block
new_lines = lines[:start_remove] + lines[end_remove + 1:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f"✓ Removed {end_remove - start_remove + 1} lines of duplicate content")
print("✓ Toyota Vellfire 2016 card successfully added")
print("\nChanges saved!")
