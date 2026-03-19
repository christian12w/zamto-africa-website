# Update Hilux SOLD badge to match Lexus LX570 style

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# The Lexus LX570 uses red badge with check-circle icon and says SOLD
# Current Hilux has x-circle, change it to check-circle like Lexus

old_hilux_badge = '''<!-- Status Badge -->
          <div class="absolute top-3 left-3 z-20">
            <span class="bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-md flex items-center gap-1">
              <i data-lucide="x-circle" class="w-3 h-3"></i>
              SOLD
            </span>
          </div>'''

new_hilux_badge = '''<!-- Status Badge -->
          <div class="absolute top-3 left-3 z-20">
            <span class="bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-md flex items-center gap-1">
              <i data-lucide="check-circle" class="w-3 h-3"></i>
              SOLD
            </span>
          </div>'''

content = content.replace(old_hilux_badge, new_hilux_badge)

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Updated Hilux SOLD badge to match Lexus LX570 style (red badge with check-circle)")
print("Changes saved!")
