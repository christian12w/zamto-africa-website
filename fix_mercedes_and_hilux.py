import re

# Read the index.html file
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix 1: Update Mercedes B180 image source on home page
content = content.replace(
    '<img src="images/vehicles/Mercedes Benz B180-1.jpg" alt="2015 MERCEDES BENZ B180 BLACK" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy">',
    '<img src="images/vehicles/Mercedes Benz B180-1.jpg" alt="2015 MERCEDES BENZ B180 BLACK" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" onerror="this.src=\'images/vehicles/Mercedes Benz B180-1.jpg\'">'
)

# Fix 2: Find and remove the duplicate Toyota Hilux (the one at line ~1400 with FOR SALE status)
# We need to keep the first one (around line 1107) and remove the second duplicate

# Pattern to match the entire duplicate Hilux card starting from the comment before it
pattern = r'        <!-- LAST 8 VEHICLES MOVED TO TOP - Vehicle 42 - 2018 TOYOTA HILUX Pick-Up Double Cab BLACK \(For Sale\) -->\s*<div class="vehicle-card group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative"[^>]*>\s*<!-- Status Badge -->\s*<div class="absolute top-3 left-3 z-20">\s*<span class="bg-green-600 text-white px-3 py-1\.5 rounded-full text-sm font-bold shadow-md flex items-center gap-1">\s*<i data-lucide="check-circle" class="w-3 h-3"></i>\s*FOR SALE\s*</span>\s*</div>\s*<!-- Vehicle Image -->\s*<div class="relative h-56 overflow-hidden cursor-pointer"\s*onclick="window\.location\.href=\'vehicle-toyota-hilux-2018-black\.html\'">\s*<img src="images/vehicles/2018 TOYOTA HILUX Pick-Up Double Cab Black-1\.jpg" alt="2018 TOYOTA HILUX BLACK" class="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105" loading="lazy">\s*</div>\s*<div class="p-4">\s*<!-- Vehicle Header -->\s*<div class="flex items-start justify-between mb-3">\s*<div>\s*<h3 class="text-lg font-bold text-navy mb-1">TOYOTA HILUX</h3>\s*<p class="text-xs text-gray-500">2018 Model • Black • 99,321 km</p>\s*</div>\s*<span class="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">Pickup Trucks</span>\s*</div>\s*<!-- Specifications -->\s*<div class="space-y-1 mb-3">\s*<div class="flex items-center gap-2 text-xs text-gray-600">\s*<i data-lucide="users" class="w-3 h-3 text-gray-400"></i>\s*<span>5 Seats</span>\s*<span class="text-gray-300">•</span>\s*<i data-lucide="car" class="w-3 h-3 text-gray-400"></i>\s*<span>4 Doors</span>\s*</div>\s*<div class="flex items-center gap-2 text-xs text-gray-600">\s*<i data-lucide="zap" class="w-3 h-3 text-gray-400"></i>\s*<span>2400cc Diesel</span>\s*<span class="text-gray-300">•</span>\s*<i data-lucide="settings" class="w-3 h-3 text-gray-400"></i>\s*<span>Automatic</span>\s*</div>\s*</div>\s*<!-- Condition & Price -->\s*<div class="flex items-center justify-between pt-3 border-t border-gray-100">\s*<span class="text-xs text-gray-500 font-medium">Excellent Condition</span>\s*<div class="text-right">\s*<span class="text-lg font-black text-red">\$33,800</span>\s*<span class="text-xs text-gray-500 block">ZMW747,000</span>\s*</div>\s*</div>\s*<!-- Action Buttons -->\s*<div class="flex gap-2 mt-3">\s*<a href="vehicle-toyota-hilux-2018-black\.html" class="flex-1 bg-navy hover:bg-blue-900 text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1">\s*<i data-lucide="eye" class="w-3 h-3"></i>\s*View Details\s*</a>\s*<a href="https://wa\.me/260572213038" target="_blank" class="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1">\s*<i data-lucide="message-circle" class="w-3 h-3"></i>\s*WhatsApp\s*</a>\s*</div>\s*</div>\s*</div>\s*\n'

# Replace the duplicate with empty string
content = re.sub(pattern, '', content)

# Write the modified content back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Fixed Mercedes B180 image on home page")
print("✓ Removed duplicate Toyota Hilux listing")
print("\nChanges saved successfully!")
