import os
import glob

pages_dir = r"c:\Users\Geetha Sri\Downloads\Home\Home\Home_Web\src\pages"
files = glob.glob(os.path.join(pages_dir, "*.tsx"))

count = 0
for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'max-w-md' in content:
        # replace max-w-md with w-full max-w-7xl
        new_content = content.replace('max-w-md', 'w-full max-w-7xl')
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        count += 1
        print(f"Updated {file}")

print(f"Total updated {count} files.")
