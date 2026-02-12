from rest_framework import filters

class BranchFilterBackend(filters.BaseFilterBackend):
    """
    Filters a queryset based on the 'X-Branch-ID' header.
    Expects the model to have a 'branch' field.
    """
    def filter_queryset(self, request, queryset, view):
        branch_id = request.headers.get('X-Branch-ID')
        
        # If no branch ID is provided, or if it's 'null'/undefined, return original queryset
        if not branch_id or branch_id == 'undefined' or branch_id == 'null':
            return queryset

        # Check if the model has a 'branch' field
        model = queryset.model
        has_branch_field = any(field.name == 'branch' for field in model._meta.get_fields())

        if has_branch_field:
            return queryset.filter(branch_id=branch_id)
        
        return queryset
