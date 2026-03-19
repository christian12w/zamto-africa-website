# Revert all FOR SALE to original and ONLY mark the specific 2018 Hilux as SOLD

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# First revert ALL SOLD badges back to FOR SALE
sold_badge = '''<!-- Status Badge -->
          <div class="absolute top-3 left-3 z-20">
            <span class="bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-md flex items-center gap-1">
              <i data-lucide="x-circle" class="w-3 h-3"></i>
              SOLD
            </span>
          </div>'''

for_sale_badge = '''<!-- Status Badge -->
          <div class="absolute top-3 left-3 z-20">
            <span class="bg-green-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-md flex items-center gap-1">
              <i data-lucide="check-circle" class="w-3 h-3"></i>
              FOR SALE
            </span>
          </div>'''

content = content.replace(sold_badge, for_sale_badge)

# Now ONLY mark the specific 2018 Hilux Black 99,321km as SOLD using unique context
old_hilux_section = '''        <!-- LAST 8 VEHICLES MOVED TO TOP - Vehicle 42 - 2018 TOYOTA HILUX Pick-Up Double Cab BLACK (For Sale) -->
        <div class="vehicle-card group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative" 
             data-category="sale" 
             data-name="TOYOTA HILUX" 
             data-type="PICKUP TRUCKS"
             data-fuel="Diesel" 
             data-transmission="Automatic" 
             data-year="2018">
          <!-- Status Badge -->
          <div class="absolute top-3 left-3 z-20">
            <span class="bg-green-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-md flex items-center gap-1">
              <i data-lucide="check-circle" class="w-3 h-3"></i>
              FOR SALE
            </span>
          </div>
          
          <!-- Vehicle Image -->
          <div class="relative h-56 overflow-hidden cursor-pointer"
               onclick="window.location.href='vehicle-toyota-hilux-2018-black.html'">
            <img src="images/vehicles/2018 TOYOTA HILUX Pick-Up Double Cab Black-1.jpg" alt="2018 TOYOTA HILUX BLACK" class="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105" loading="lazy">
          </div>
          
          <div class="p-4">
            <!-- Vehicle Header -->
            <div class="flex items-start justify-between mb-3">
              <div>
                <h3 class="text-lg font-bold text-navy mb-1">TOYOTA HILUX</h3>
                <p class="text-xs text-gray-500">2018 Model • Black • 99,321 km</p>
              </div>
              <span class="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">Pickup Trucks</span>
            </div>
            
            <!-- Specifications -->
            <div class="space-y-1 mb-3">
              <div class="flex items-center gap-2 text-xs text-gray-600">
                <i data-lucide="users" class="w-3 h-3 text-gray-400"></i>
                <span>5 Seats</span>
                <span class="text-gray-300">•</span>
                <i data-lucide="car" class="w-3 h-3 text-gray-400"></i>
                <span>4 Doors</span>
              </div>
              <div class="flex items-center gap-2 text-xs text-gray-600">
                <i data-lucide="zap" class="w-3 h-3 text-gray-400"></i>
                <span>2400cc Diesel</span>
                <span class="text-gray-300">•</span>
                <i data-lucide="settings" class="w-3 h-3 text-gray-400"></i>
                <span>Manual</span>
              </div>
            </div>
            
            <!-- Condition & Price -->
            <div class="flex items-center justify-between pt-3 border-t border-gray-100">
              <span class="text-xs text-gray-500 font-medium">Excellent Condition</span>
              <div class="text-right">
                <span class="text-lg font-black text-red">$33,800</span>
                <span class="text-xs text-gray-500 block">ZMW747,000</span>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex gap-2 mt-3">
              <a href="vehicle-toyota-hilux-2018-black.html" class="flex-1 bg-navy hover:bg-blue-900 text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1">
                <i data-lucide="eye" class="w-3 h-3"></i>
                View Details
              </a>
              <a href="https://wa.me/260572213038" target="_blank" class="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1">
                <i data-lucide="message-circle" class="w-3 h-3"></i>
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <!-- Vehicle 43 - 2016 LEXUS RX200T SUVs & Crossovers WHITE (For Sale) -->'''

new_hilux_section = '''        <!-- LAST 8 VEHICLES MOVED TO TOP - Vehicle 42 - 2018 TOYOTA HILUX Pick-Up Double Cab BLACK (SOLD) -->
        <div class="vehicle-card group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden opacity-80 relative" 
             data-category="sale" 
             data-name="TOYOTA HILUX" 
             data-type="PICKUP TRUCKS"
             data-fuel="Diesel" 
             data-transmission="Manual" 
             data-year="2018">
          <!-- Status Badge -->
          <div class="absolute top-3 left-3 z-20">
            <span class="bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-md flex items-center gap-1">
              <i data-lucide="x-circle" class="w-3 h-3"></i>
              SOLD
            </span>
          </div>
          
          <!-- Vehicle Image -->
          <div class="relative h-56 overflow-hidden">
            <img src="images/vehicles/2018 TOYOTA HILUX Pick-Up Double Cab Black-1.jpg" alt="2018 TOYOTA HILUX BLACK" class="w-full h-full object-cover object-center" loading="lazy">
          </div>
          
          <div class="p-4">
            <!-- Vehicle Header -->
            <div class="flex items-start justify-between mb-3">
              <div>
                <h3 class="text-lg font-bold text-navy mb-1">TOYOTA HILUX</h3>
                <p class="text-xs text-gray-500">2018 Model • Black • 99,321 km</p>
              </div>
              <span class="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">Pickup Trucks</span>
            </div>
            
            <!-- Specifications -->
            <div class="space-y-1 mb-3">
              <div class="flex items-center gap-2 text-xs text-gray-600">
                <i data-lucide="users" class="w-3 h-3 text-gray-400"></i>
                <span>5 Seats</span>
                <span class="text-gray-300">•</span>
                <i data-lucide="car" class="w-3 h-3 text-gray-400"></i>
                <span>4 Doors</span>
              </div>
              <div class="flex items-center gap-2 text-xs text-gray-600">
                <i data-lucide="zap" class="w-3 h-3 text-gray-400"></i>
                <span>2400cc Diesel</span>
                <span class="text-gray-300">•</span>
                <i data-lucide="settings" class="w-3 h-3 text-gray-400"></i>
                <span>Manual</span>
              </div>
            </div>
            
            <!-- Condition & Status -->
            <div class="flex items-center justify-between pt-3 border-t border-gray-100">
              <span class="text-xs text-gray-500 font-medium">Sold</span>
              <div class="text-right">
                <span class="text-lg font-black text-red-600">SOLD</span>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex gap-2 mt-3">
              <a href="tel:+260572213038" class="flex-1 bg-navy hover:bg-blue-900 text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1">
                <i data-lucide="phone" class="w-3 h-3"></i>
                Call Now
              </a>
              <a href="https://wa.me/260572213038" target="_blank" class="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1">
                <i data-lucide="message-circle" class="w-3 h-3"></i>
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <!-- Vehicle 43 - 2016 LEXUS RX200T SUVs & Crossovers WHITE (For Sale) -->'''

content = content.replace(old_hilux_section, new_hilux_section)

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Reverted all vehicles to FOR SALE")
print("✓ Marked ONLY the 2018 Toyota Hilux Black 99,321km as SOLD")
print("\nChanges saved!")
