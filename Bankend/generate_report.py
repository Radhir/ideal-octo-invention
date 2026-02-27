import os
from django.apps import apps
from django.urls import get_resolver

out = []
out.append("# Elite Shine ERP - Full System Architecture Report\n")
out.append("This comprehensive report details all the Database Models (tables, fields, relationships) and API Endpoints registered in the backend.\n")

out.append("## 1. Database Data Models\n")

# Filter out standard django/library apps to keep report focused on the ERP core
ignore_apps = ['admin', 'contenttypes', 'sessions', 'messages', 'staticfiles', 
               'rest_framework', 'corsheaders', 'drf_yasg', 'django_celery_results', 
               'django_celery_beat', 'knox', 'treebeard']

for app_config in apps.get_app_configs():
    if app_config.name in ignore_apps or (app_config.name.startswith('django') and app_config.name != 'django.contrib.auth'):
        continue
        
    app_models = list(app_config.get_models())
    if not app_models:
        continue
        
    out.append(f"### Module: `{app_config.verbose_name.title()}`\n")
    
    for model in app_models:
        out.append(f"#### Model: `{model.__name__}`")
        out.append(f"**Database Table:** `{model._meta.db_table}`\n")
        out.append("| Field Name | Data Type | Properties & Relations |")
        out.append("|---|---|---|")
        
        for field in model._meta.get_fields():
            field_name = field.name
            field_type = field.__class__.__name__
            props = []
            
            if getattr(field, 'null', False): props.append('null')
            if getattr(field, 'blank', False): props.append('blank')
            if getattr(field, 'unique', False): props.append('unique')
            if getattr(field, 'primary_key', False): props.append('PK')
            
            if field.is_relation:
                if hasattr(field, 'related_model') and field.related_model:
                    props.insert(0, f"**→ {field.related_model.__name__}**")
                    
            prop_str = ", ".join(props) if props else "-"
            out.append(f"| `{field_name}` | {field_type} | {prop_str} |")
            
        out.append("\n")

out.append("## 2. API Endpoints & Application Routes\n")
out.append("| Route Pattern | Internal Name |")
out.append("|---|---|")

def get_urls(url_patterns, prefix=''):
    lines = []
    for pattern in url_patterns:
        if hasattr(pattern, 'url_patterns'):
            lines.extend(get_urls(pattern.url_patterns, prefix + str(pattern.pattern)))
        else:
            url = prefix + str(pattern.pattern)
            name = getattr(pattern, 'name', '') or ''
            
            # Clean up Django URL regex formatting for readability
            clean_url = url.replace('^', '').replace('$', '').replace('\\', '').replace('(?P', '{').replace('<', '{').replace('>', '}')
            lines.append(f"| `/{clean_url}` | `{name}` |")
    return lines

resolver = get_resolver()
url_lines = get_urls(resolver.url_patterns)

# Remove duplicates and sort
unique_urls = sorted(set(url_lines))
for line in unique_urls:
    out.append(line)

with open('R:\\webplot\\Bankend\\erp_full_report.md', 'w', encoding='utf-8') as f:
    f.write('\n'.join(out))

print("Report successfully generated at R:\\webplot\\Bankend\\erp_full_report.md")
