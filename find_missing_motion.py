import os
import re

def find_missing_imports(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.jsx', '.js', '.tsx', '.ts')):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                        # Find usage of motion. (like <motion.div)
                        uses_motion = re.search(r'motion\.', content)
                        # Find import of motion from framer-motion
                        has_import = re.search(r"import.*motion.*from ['\"]framer-motion['\"]", content)
                        
                        if uses_motion and not has_import:
                            print(f"File with missing motion import: {path}")
                except Exception as e:
                    print(f"Error reading {path}: {e}")

if __name__ == "__main__":
    find_missing_imports(r"r:\webplot\frontend\src")
