import os
import re

def find_missing_motion_imports(directory):
    files_with_issues = []
    
    # Regex to find usage of motion (e.g., <motion.div, motion.div, motion(Component))
    # Excluding motion inside strings or comments (roughly)
    motion_usage_pattern = re.compile(r'\b(motion\.(div|span|button|nav|ul|li|footer|header|section|aside|h\d|p|input|a)|motion\s*\()')
    
    # Regex for framer-motion import
    import_pattern = re.compile(r'from\s+[\'"]framer-motion[\'"]')

    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.jsx') or file.endswith('.js'):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                    
                    if motion_usage_pattern.search(content):
                        if not import_pattern.search(content):
                            files_with_issues.append(path)
                            
    return files_with_issues

if __name__ == "__main__":
    src_dir = r"r:\webplot\frontend\src"
    issues = find_missing_motion_imports(src_dir)
    if issues:
        print("Files using 'motion' without 'framer-motion' import:")
        for issue in issues:
            print(issue)
    else:
        print("No issues found.")
