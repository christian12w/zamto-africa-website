# Mark Toyota Hilux 2018 Black as SOLD

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace the FOR SALE badge with SOLD for the Hilux
old_badge = '''<!-- Status Badge -->
          <div class="absolute top-3 left-3 z-20">
            <span class="bg-green-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-md flex items-center gap-1">
              <i data-lucide="check-circle" class="w-3 h-3"></i>
              FOR SALE
            </span>
          </div>'''

new_badge = '''<!-- Status Badge -->
          <div class="absolute top-3 left-3 z-20">
            <span class="bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-md flex items-center gap-1">
              <i data-lucide="x-circle" class="w-3 h-3"></i>
              SOLD
            </span>
          </div>'''

content = content.replace(old_badge, new_badge)

# Remove onclick from vehicle image div for sold vehicle
old_image_div = '<!-- Vehicle Image -->\n          <div class="relative h-56 overflow-hidden cursor-pointer"\n               onclick="window.location.href=\'vehicle-toyota-hilux-2018-black.html\'">'
new_image_div = '<!-- Vehicle Image -->\n          <div class="relative h-56 overflow-hidden">'

content = content.replace(old_image_div, new_image_div)

# Change condition and price to SOLD status
old_condition = '''<!-- Condition & Price -->
            <div class="flex items-center justify-between pt-3 border-t border-gray-100">
              <span class="text-xs text-gray-500 font-medium">Excellent Condition</span>
              <div class="text-right">
                <span class="text-lg font-black text-red">$33,800</span>
                <span class="text-xs text-gray-500 block">ZMW747,000</span>
              </div>
            </div>'''

new_condition = '''<!-- Condition & Status -->
            <div class="flex items-center justify-between pt-3 border-t border-gray-100">
              <span class="text-xs text-gray-500 font-medium">Sold</span>
              <div class="text-right">
                <span class="text-lg font-black text-red-600">SOLD</span>
              </div>
            </div>'''

content = content.replace(old_condition, new_condition)

# Change action buttons for sold vehicle
old_buttons = '''<!-- Action Buttons -->
            <div class="flex gap-2 mt-3">
              <a href="vehicle-toyota-hilux-2018-black.html" class="flex-1 bg-navy hover:bg-blue-900 text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1">
                <i data-lucide="eye" class="w-3 h-3"></i>
                View Details
              </a>
              <a href="https://wa.me/260572213038" target="_blank" class="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1">
                <i data-lucide="message-circle" class="w-3 h-3"></i>
                WhatsApp
              </a>
            </div>'''

new_buttons = '''<!-- Action Buttons -->
            <div class="flex gap-2 mt-3">
              <a href="tel:+260572213038" class="flex-1 bg-navy hover:bg-blue-900 text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1">
                <i data-lucide="phone" class="w-3 h-3"></i>
                Call Now
              </a>
              <a href="https://wa.me/260572213038" target="_blank" class="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1">
                <i data-lucide="message-circle" class="w-3 h-3"></i>
                WhatsApp
              </a>
            </div>'''

content = content.replace(old_buttons, new_buttons)

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Toyota Hilux 2018 Black marked as SOLD")
print("Changes saved!")
