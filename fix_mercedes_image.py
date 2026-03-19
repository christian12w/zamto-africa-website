# Fix Mercedes B180 image and remove duplicate Hilux

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix 1: Change Mercedes B180 image from -1.jpg to -2.jpg (since -1.txt is not an image)
content = content.replace(
    'src="images/vehicles/Mercedes Benz B180-1.jpg"',
    'src="images/vehicles/Mercedes Benz B180-2.jpg"'
)
content = content.replace(
    'onerror="this.src=\'images/vehicles/Mercedes Benz B180-1.jpg\'"',
    'onerror="this.src=\'images/vehicles/Mercedes Benz B180-2.jpg\'"'
)

# Write the modified content back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Fixed Mercedes B180 image to use Mercedes Benz B180-2.jpg")
print("\nChanges saved!")
