
    def destroy(self, request, *args, **kwargs):
        # Override delete to just deactivate
        employee = self.get_object()
        user = employee.user
        
        # Deactivate
        user.is_active = False
        user.save()
        
        employee.is_active = False
        employee.save()
        
        return Response(status=status.HTTP_204_NO_CONTENT)
