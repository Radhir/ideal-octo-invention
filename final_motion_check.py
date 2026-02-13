import os

def find_missing_motion(directory):
    issues = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.jsx') or file.endswith('.js'):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        # Simple check: does it contain 'motion' but NOT 'framer-motion'?
                        # We use word boundary for motion to avoid stuff like 'promotional'
                        import re
                        has_motion = re.search(r'\bmotion\b', content)
                        has_import = 'framer-motion' in content
                        
                        if has_motion and not has_import:
                            # Verify if it's not a comment
                            # This is a bit rough but effective for a quick scan
                            lines = content.splitlines()
                            for line in lines:
                                if re.search(r'\bmotion\b', line) and not line.strip().startswith('//') and ' * ' not in line:
                                    issues.append(path)
                                    break
                except:
                    pass
    return issues

if __name__ == "__main__":
    issues = find_missing_motion(r"r:\webplot\frontend\src")
    if issues:
        print("FILES WITH MISSING MOTION IMPORT:")
        for i in issues:
            print(i)
    else:
        print("No missing imports found.")
