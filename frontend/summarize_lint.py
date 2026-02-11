import json
import collections
import os

def summarize_lint(report_path):
    if not os.path.exists(report_path):
        print(f"File not found: {report_path}")
        return

    with open(report_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the start of the JSON array
    try:
        start_idx = content.index('[')
        json_content = content[start_idx:]
        data = json.loads(json_content)
    except (ValueError, json.JSONDecodeError) as e:
        print(f"Error parsing JSON: {e}")
        return
    
    total_errors = 0
    total_warnings = 0
    rule_counts = collections.Counter()
    file_problems = []
    
    for entry in data:
        errors = entry.get('errorCount', 0)
        warnings = entry.get('warningCount', 0)
        total_errors += errors
        total_warnings += warnings
        
        if errors + warnings > 0:
            file_problems.append((entry['filePath'], errors, warnings))
            for message in entry.get('messages', []):
                rule_id = message.get('ruleId', 'unknown')
                rule_counts[rule_id] += 1
                
    print(f"Total Errors: {total_errors}")
    print(f"Total Warnings: {total_warnings}")
    print("\nTop Internal Rules:")
    for rule, count in rule_counts.most_common(15):
        print(f"  {rule}: {count}")
        
    print("\nFiles with most problems:")
    file_problems.sort(key=lambda x: x[1] + x[2], reverse=True)
    for path, errs, warns in file_problems:
        # Just use the basename for clarity
        basename = os.path.basename(path)
        print(f"  {basename}: {errs} errors, {warns} warnings ({path})")

if __name__ == "__main__":
    summarize_lint('lint_report.json')
