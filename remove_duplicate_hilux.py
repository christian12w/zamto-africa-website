# Remove the duplicate Toyota Hilux at line 1399-1470

with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find and remove the duplicate Hilux section (from line 1399 to 1470)
# Note: lines are 0-indexed, so line 1399 is at index 1398
start_line = 1398  # Line 1399 (0-indexed)
end_line = 1470    # Line 1470 (0-indexed, inclusive)

# Remove lines from start_line to end_line (inclusive)
removed_lines = lines[start_line:end_line + 1]

# Create new content without those lines
new_lines = lines[:start_line] + lines[end_line + 1:]

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f"✓ Removed {len(removed_lines)} lines (duplicate Toyota Hilux)")
print("Changes saved!")
