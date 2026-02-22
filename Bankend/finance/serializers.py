from rest_framework import serializers
from .models import Account, AccountCategory, Budget, Voucher, VoucherDetail, Commission, AccountGroup, FixedAsset

class AccountCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountCategory
        fields = '__all__'

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'

class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = '__all__'

class VoucherDetailSerializer(serializers.ModelSerializer):
    account_name = serializers.CharField(source='account.name', read_only=True)
    
    class Meta:
        model = VoucherDetail
        fields = ['id', 'account', 'account_name', 'debit', 'credit', 'description']

class VoucherSerializer(serializers.ModelSerializer):
    details = VoucherDetailSerializer(many=True)
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)
    
    class Meta:
        model = Voucher
        fields = ['id', 'voucher_number', 'voucher_type', 'date', 'reference_number', 
                 'narration', 'payment_mode', 'cheque_number', 'cheque_date', 
                 'payee_name', 'status', 'created_by_name', 'total_amount', 'details']

    def create(self, validated_data):
        details_data = validated_data.pop('details')
        voucher = Voucher.objects.create(**validated_data)
        for detail_data in details_data:
            VoucherDetail.objects.create(voucher=voucher, **detail_data)
        return voucher

class AccountGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountGroup
        fields = '__all__'

class CommissionSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.full_name', read_only=True)
    job_card_number = serializers.CharField(source='job_card.job_card_number', read_only=True)
    
    class Meta:
        model = Commission
        fields = '__all__'
class FixedAssetSerializer(serializers.ModelSerializer):
    current_book_value = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    monthly_depreciation = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    branch_name = serializers.CharField(source='branch.name', read_only=True)

    class Meta:
        model = FixedAsset
        fields = '__all__'
