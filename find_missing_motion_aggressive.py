import os
import re

def find_missing_motion_aggressive(directory):
    files_with_issues = []
    
    # Very broad pattern for 'motion' as a word
    motion_pattern = re.compile(r'\bmotion[\.\(\s]')
    
    # Pattern for imports
    import_pattern = re.compile(r'import.*from.*[\'"]framer-motion[\'"]')

    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.jsx') or file.endswith('.js'):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        lines = f.readlines()
                        
                        has_motion = False
                        has_import = False
                        
                        for line in lines:
                            if import_pattern.search(line):
                                has_import = True
                            if motion_pattern.search(line):
                                # Check if it's not a comment
                                stripped = line.strip()
                                if not stripped.startswith('//') and not stripped.startswith('/*') and ' * ' not in stripped:
                                    has_motion = True
                        
                        if has_motion and not has_import:
                            files_with_issues.append(path)
                except Exception as e:
                    print(f"Error reading {path}: {e}")
                            
    return files_with_issues

if __name__ == "__main__":
    src_dir = r"r:\webplot\frontend\src"
    issues = find_missing_motion_aggressive(src_dir)
    if issues:
        print("POTENTIAL ISSUES:")
        for issue in issues:
            print(issue)
    else:
        print("No definitive issues found.")
