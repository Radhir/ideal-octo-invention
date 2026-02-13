import os
import re

def find_missing_motion_precise(directory):
    issues = []
    # Usage pattern: <motion. something or motion.something or {motion}
    usage_pattern = re.compile(r'\bmotion\.(div|span|button|nav|ul|li|footer|header|section|aside|h\d|p|input|a)\b')
    # Import pattern: import { ...motion... } from 'framer-motion'
    import_pattern = re.compile(r'import\s+\{[^}]*?\bmotion\b[^}]*?\}\s+from\s+[\'"]framer-motion[\'"]')

    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.jsx') or file.endswith('.js'):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        if usage_pattern.search(content):
                            if not import_pattern.search(content):
                                issues.append(path)
                except:
                    pass
    return issues

if __name__ == "__main__":
    issues = find_missing_motion_precise(r"r:\webplot\frontend\src")
    if issues:
        print("FILES MISSING PRECISE MOTION IMPORT:")
        for i in issues:
            print(i)
    else:
        print("No precise issues found.")
