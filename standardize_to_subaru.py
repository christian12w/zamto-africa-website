import os
import re
from pathlib import Path
from bs4 import BeautifulSoup

# The master template file
TEMPLATE_FILE = "vehicle-subaru-forester-2019.html"

# Files to update (all vehicle detail pages)
def get_all_vehicle_files():
    files = [f for f in os.listdir('.') if f.startswith('vehicle-') and f.endswith('.html')]
    if TEMPLATE_FILE in files:
        files.remove(TEMPLATE_FILE)
    return files

def read_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(filepath, content):
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def extract_vehicle_data(html_content, filename):
    soup = BeautifulSoup(html_content, 'html.parser')
    data = {}
    
    # 1. Title and Meta
    data['title'] = soup.title.string if soup.title else ""
    desc_meta = soup.find('meta', attrs={'name': 'description'})
    data['description_meta'] = desc_meta['content'] if desc_meta else ""
    
    # 2. Vehicle Name and Price
    # Look for H1 in the main content area
    h1 = soup.find('h1')
    data['vehicle_name'] = h1.get_text(strip=True) if h1 else filename.replace('vehicle-', '').replace('.html', '').replace('-', ' ').title()
    
    # Price
    # Try to find price based on common classes or text patterns
    price_div = soup.find('div', string=re.compile(r'\$|ZMW|USD', re.IGNORECASE))
    if not price_div:
        # Try a more broad search for price-like patterns
        price_text = soup.find(string=re.compile(r'(\$\s?[\d,]+|ZMW\s?[\d,]+|USD\s?[\d,]+)'))
        data['price'] = price_text.strip() if price_text else "Price on Request"
    else:
        data['price'] = price_div.get_text(strip=True)
        
    # Model/Spec line (e.g., "2019 Model • Premium AWD SUV")
    model_line = soup.find('p', class_='text-lg text-gray-600 mb-4')
    data['model_line'] = model_line.get_text(strip=True) if model_line else ""

    # 3. Quick Specs (Year, Engine, Transmission, Seats, Doors, Fuel)
    specs = {}
    spec_cards = soup.find_all('div', class_='bg-gray-50 p-4 rounded-xl text-center')
    for card in spec_cards:
        label = card.find('p', class_='text-sm text-gray-600').get_text(strip=True)
        value = card.find('p', class_='font-bold text-navy').get_text(strip=True)
        specs[label] = value
    data['quick_specs'] = specs

    # 4. Description
    desc_title = soup.find('h3', string=re.compile(r'Description', re.IGNORECASE))
    if desc_title:
        desc_p = desc_title.find_next('p')
        data['description'] = desc_p.get_text(strip=True) if desc_p else ""
    else:
        data['description'] = ""

    # 5. Images
    main_img = soup.find('img', class_='main-vehicle-image')
    data['main_image'] = main_img['src'] if main_img and main_img.has_attr('src') else ""
    
    thumbnails = []
    thumb_imgs = soup.find_all('img', class_='thumbnail-image')
    for img in thumb_imgs:
        if img.has_attr('src'):
            thumbnails.append(img['src'])
    data['thumbnails'] = thumbnails

    # 6. Detailed Specs (Tab 1)
    spec_rows = []
    spec_tab = soup.find('div', id='specifications-tab')
    if spec_tab:
        rows = spec_tab.find_all('div', class_='flex justify-between spec-row p-3 rounded-lg')
        for row in rows:
            label = row.find('span', class_='text-gray-600').get_text(strip=True)
            value = row.find('span', class_='font-semibold text-navy').get_text(strip=True)
            spec_rows.append((label, value))
    data['detailed_specs'] = spec_rows

    # 7. Features (Tab 2)
    features = []
    features_tab = soup.find('div', id='features-tab')
    if features_tab:
        items = features_tab.find_all('span', class_='text-gray-700')
        for item in items:
            features.append(item.get_text(strip=True))
    data['features'] = features

    return data

def apply_template(template_html, data):
    # This is where we inject the data into the Subaru template
    # We'll use simple string replacements or BeautifulSoup to inject
    soup = BeautifulSoup(template_html, 'html.parser')
    
    # 1. Update Title and Meta
    if soup.title:
        soup.title.string = data['title']
    desc_meta = soup.find('meta', attrs={'name': 'description'})
    if desc_meta:
        desc_meta['content'] = data['description_meta']
        
    # 2. Update Breadcrumbs (last item)
    breadcrumb_span = soup.find('span', class_='text-navy font-medium')
    if breadcrumb_span:
        breadcrumb_span.string = data['vehicle_name']
        
    # 3. Update Gallery
    main_img = soup.find('img', class_='main-vehicle-image')
    if main_img:
        main_img['src'] = data['main_image']
        # Also update data-gallery and onclick
        gallery_str = ",".join(data['thumbnails'])
        main_img['data-gallery'] = gallery_str
        main_img['onclick'] = f"openLightbox([{', '.join([repr(t) for t in data['thumbnails']])}], 0)"
        
    # Update thumbnails (Subaru has 4 thumb slots, one is "View All")
    thumb_containers = soup.find_all('div', class_=re.compile(r'bg-gray-100 rounded-lg h-20 overflow-hidden'))
    for i, container in enumerate(thumb_containers[:3]): # Update first 3
        if i < len(data['thumbnails']):
            img = container.find('img')
            if img:
                img['src'] = data['thumbnails'][i]
            container['onclick'] = f"changeMainImage('{data['thumbnails'][i]}')"
        else:
            # Hide extra thumbs if not enough images
            container.decompose()
            
    # Update "View All" count
    view_all_span = soup.find('span', string=re.compile(r'View All'))
    if view_all_span:
        view_all_span.string = f"View All {len(data['thumbnails'])}"

    # 4. Update Header Info (H1, Model Line, Price)
    h1 = soup.find('h1', class_=re.compile(r'text-navy.*font-heading'))
    if h1:
        h1.string = data['vehicle_name']
        
    model_p = soup.find('p', class_='text-lg text-gray-600 mb-4')
    if model_p:
        model_p.string = data['model_line']
        
    price_div = soup.find('div', class_='text-4xl sm:text-5xl font-black text-red')
    if price_div:
        price_div.string = data['price']

    # 5. Update Quick Specs
    spec_cards = soup.find_all('div', class_='bg-gray-50 p-4 rounded-xl text-center')
    # Loop through quick specs and update matching labels
    for card in spec_cards:
        label_p = card.find('p', class_='text-sm text-gray-600')
        value_p = card.find('p', class_='font-bold text-navy')
        if label_p and value_p:
            label = label_p.get_text(strip=True)
            if label in data['quick_specs']:
                value_p.string = data['quick_specs'][label]

    # 6. Update Description
    desc_p = soup.find('h3', string=re.compile(r'Description')).find_next('p')
    if desc_p:
        desc_p.string = data['description']

    # 7. Update Detailed Specs (Tab 1)
    spec_grid = soup.find('div', class_='specifications-grid')
    if spec_grid:
        # Clear existing rows and rebuild
        spec_grid.decompose()
        # Re-create the grid structure
        new_grid = soup.new_tag('div', attrs={'class': 'specifications-grid grid grid-cols-1 md:grid-cols-2 gap-6'})
        left_col = soup.new_tag('div', attrs={'class': 'space-y-4'})
        right_col = soup.new_tag('div', attrs={'class': 'space-y-4'})
        
        for i, (label, value) in enumerate(data['detailed_specs']):
            row = soup.new_tag('div', attrs={'class': 'flex justify-between spec-row p-3 rounded-lg'})
            l_span = soup.new_tag('span', attrs={'class': 'text-gray-600'})
            l_span.string = label
            v_span = soup.new_tag('span', attrs={'class': 'font-semibold text-navy'})
            v_span.string = value
            row.append(l_span)
            row.append(v_span)
            
            if i % 2 == 0:
                left_col.append(row)
            else:
                right_col.append(row)
        
        new_grid.append(left_col)
        new_grid.append(right_col)
        soup.find('div', id='specifications-tab').append(new_grid)

    # 8. Update Features (Tab 2)
    features_grid = soup.find('div', class_='features-grid')
    if features_grid:
        features_grid.decompose()
        new_features = soup.new_tag('div', attrs={'class': 'features-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'})
        for feature in data['features']:
            item = soup.new_tag('div', attrs={'class': 'flex items-center gap-3 p-3 bg-gray-50 rounded-lg'})
            icon = soup.new_tag('i', attrs={'data-lucide': 'check-circle', 'class': 'w-5 h-5 text-green-600'})
            span = soup.new_tag('span', attrs={'class': 'text-gray-700'})
            span.string = feature
            item.append(icon)
            item.append(span)
            new_features.append(item)
        soup.find('div', id='features-tab').append(new_features)

    # Note: Tab 3 (Condition Report) remains as Subaru's placeholder text for now or we could customize it
    # CTAs (WhatsApp, Call) are already standardized in the template

    return str(soup)

def main():
    template_html = read_file(TEMPLATE_FILE)
    vehicle_files = get_all_vehicle_files()
    
    print(f"Standardizing {len(vehicle_files)} files to Subaru design...")
    
    for filename in vehicle_files:
        print(f"Processing {filename}...")
        try:
            content = read_file(filename)
            data = extract_vehicle_data(content, filename)
            new_content = apply_template(template_html, data)
            write_file(filename, new_content)
        except Exception as e:
            print(f"Error processing {filename}: {e}")

if __name__ == "__main__":
    main()
