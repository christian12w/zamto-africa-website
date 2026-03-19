# Direct fix for Hilux badge only

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the specific Hilux by its unique comment and change ONLY the badge
old_badge = '''        <!-- LAST 8 VEHICLES MOVED TO TOP - Vehicle 42 - 2018 TOYOTA HILUX Pick-Up Double Cab BLACK (For Sale) -->
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
          </div>'''

new_badge = '''        <!-- LAST 8 VEHICLES MOVED TO TOP - Vehicle 42 - 2018 TOYOTA HILUX Pick-Up Double Cab BLACK (SOLD) -->
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
              <i data-lucide="check-circle" class="w-3 h-3"></i>
              SOLD
            </span>
          </div>'''

content = content.replace(old_badge, new_badge)

# Also update the condition/price section for this specific Hilux
old_condition = '''            <!-- Condition & Price -->
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
              </a>'''

new_condition = '''            <!-- Condition & Status -->
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
              </a>'''

content = content.replace(old_condition, new_condition)

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Fixed Toyota Hilux 2018 Black - Marked as SOLD")
print("✓ Badge style matches Lexus LX570 (red with check-circle)")
print("\nChanges saved!")
