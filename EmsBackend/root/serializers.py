from rest_framework import serializers
from .models import (Departments, EmployeeTypes, UserTypes, Employees, EmployeeEducation, EmployeeEmails, EmployeePhones, 
                   Users, Salary, SalaryPayments, BankAccountDetails, TrainingBudget, TrainingRequest,
                   LeaveType, EmployeeLeaveBalance, LeaveApplications, ResourceAllocation, EmployeeDetails)

class DepartmentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departments
        fields = ['dno', 'dname', 'noofemp', 'dlocation']
        read_only_fields = ['dno']

class EmployeeTypesSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeTypes
        fields = ['etid', 'employeetype']
        read_only_fields = ['etid']


class UserTypesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTypes
        fields = ['urid', 'usertype']
        read_only_fields = ['urid']


class EmployeesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employees
        fields = ['eid', 'fullname', 'initname', 'dob', 'gender', 'country', 'address', 'maritialstatus', 'image', 'etid', 'dno', 'designation', 'urid', 'status']
        read_only_fields = ['eid']


class EmployeeEducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeEducation
        fields = ['id', 'eid', 'degree', 'educationlevel', 'university', 'startedyear', 'status', 'completedyear']
        read_only_fields = ['id']


class EmployeeEmailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeEmails
        fields = ['eid', 'emailtype', 'email']
        read_only_fields = ['email']


class EmployeePhonesSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeePhones
        fields = ['eid', 'phonetype', 'phoneno']
        read_only_fields = ['phoneno']


class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['eid', 'email', 'password', 'urid']
        read_only_fields = ['eid']


class SalarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Salary
        fields = ['eid', 'basicsalary', 'internetchages', 'allowances', 'deductions', 'epf_employee', 'epf_employer', 'etf_employer', 'netsalary']
        read_only_fields = ['eid']
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        # Calculate EPF and ETF values based on basic salary if they're missing
        try:
            basic_salary = float(instance.basicsalary) if instance.basicsalary else 0
            
            # Set EPF employee value (8% of basic salary)
            if representation['epf_employee'] is None or representation['epf_employee'] == '0.00':
                epf_employee = basic_salary * 0.08
                representation['epf_employee'] = "{:.2f}".format(epf_employee)
            
            # Set EPF employer value (12% of basic salary)
            if representation['epf_employer'] is None or representation['epf_employer'] == '0.00':
                epf_employer = basic_salary * 0.12
                representation['epf_employer'] = "{:.2f}".format(epf_employer)
            
            # Set ETF employer value (3% of basic salary)
            if representation['etf_employer'] is None or representation['etf_employer'] == '0.00':
                etf_employer = basic_salary * 0.03
                representation['etf_employer'] = "{:.2f}".format(etf_employer)
            
        except Exception as e:
            # Log any errors but don't break the response
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error calculating EPF/ETF values: {str(e)}")
        
        return representation


class SalaryPaymentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalaryPayments
        fields = ['eid', 'salary', 'paiddate']
        
    def to_representation(self, instance):
        # Create a custom representation that guarantees the format we need
        try:
            # Get the employee ID as a string
            if hasattr(instance.eid, 'eid'):
                employee_id = instance.eid.eid
            else:
                employee_id = str(instance.eid)
                
            # Format the salary with 2 decimal places
            if instance.salary is not None:
                salary = float(instance.salary)
                salary_formatted = "{:.2f}".format(salary)
            else:
                salary_formatted = "0.00"
                
            # Format the date as ISO string
            if instance.paiddate:
                date_str = instance.paiddate.isoformat()
            else:
                date_str = ""
                
            # Create a unique composite ID for frontend reference
            if instance.paiddate:
                composite_id = f"{employee_id}_{instance.paiddate.strftime('%Y%m%d')}"
            else:
                composite_id = f"{employee_id}_unknown"
                
            # Return the properly formatted data
            return {
                'id': composite_id,
                'eid': employee_id,
                'salary': salary_formatted,
                'paiddate': date_str
            }
        except Exception as e:
            # Log the error
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error in SalaryPaymentsSerializer: {str(e)}")
            
            # Return fallback data structure
            return {
                'id': f"unknown_{id(instance)}",
                'eid': "unknown",
                'salary': "0.00",
                'paiddate': ""
            }


class BankAccountDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankAccountDetails
        fields = ['eid', 'bankaccountholdername', 'bankaccno', 'bankname', 'bankbranchname']


class TrainingBudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingBudget
        fields = ['eid', 'trainingbudgetrate', 'trainingbudgetamount', 'remainingamount']


class TrainingRequestSerializer(serializers.ModelSerializer):
    # Add a virtual ID field for frontend compatibility
    id = serializers.SerializerMethodField()
    
    class Meta:
        model = TrainingRequest
        fields = ['id', 'eid', 'requestedamount', 'reason', 'applieddate', 'status', 'granteddate', 'proofdocumenturl']
    
    def get_id(self, instance):
        # Generate a unique identifier using the eid since we don't have an id field
        return f"tr_{instance.eid}"
    
    def to_representation(self, instance):
        # Get the default representation
        representation = super().to_representation(instance)
        
        # Format applied date if it exists
        if representation['applieddate'] and representation['applieddate'] != 'null':
            try:
                from datetime import datetime
                date_obj = datetime.strptime(representation['applieddate'], '%Y-%m-%d')
                representation['applieddate'] = date_obj.strftime('%Y-%m-%d')
            except Exception:
                # If there's an error, keep the original format
                pass
        
        # Format granted date if it exists
        if representation['granteddate'] and representation['granteddate'] != 'null':
            try:
                from datetime import datetime
                date_obj = datetime.strptime(representation['granteddate'], '%Y-%m-%d')
                representation['granteddate'] = date_obj.strftime('%Y-%m-%d')
            except Exception:
                # If there's an error, keep the original format
                pass
        
        return representation


# Leave related serializers
class LeaveTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveType
        fields = ['lid', 'leavetype']
        read_only_fields = ['lid']


class EmployeeLeaveBalanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeLeaveBalance
        fields = ['eid', 'totalannualleaves', 'totalcasualleaves', 'annualleavebalance', 'casualleavebalance']
        read_only_fields = ['eid']


class LeaveApplicationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveApplications
        fields = ['lid', 'eid', 'fromdate', 'todate', 'noofdays', 'description', 'status', 'priority']
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        # Format dates
        if representation['fromdate']:
            try:
                from datetime import datetime
                date_obj = datetime.strptime(representation['fromdate'], '%Y-%m-%d')
                representation['fromdate'] = date_obj.strftime('%Y-%m-%d')
            except Exception:
                pass
        
        if representation['todate']:
            try:
                from datetime import datetime
                date_obj = datetime.strptime(representation['todate'], '%Y-%m-%d')
                representation['todate'] = date_obj.strftime('%Y-%m-%d')
            except Exception:
                pass
        
        return representation
        
        return representation


class ResourceAllocationSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField()
    
    class Meta:
        model = ResourceAllocation
        fields = ['allocationid', 'eid', 'rid', 'allocateddate', 'collecteddate', 'useddays', 'employee_name']
        read_only_fields = ['allocationid', 'useddays']
    
    def get_employee_name(self, obj):
        try:
            employee = Employees.objects.get(eid=obj.eid)
            return employee.fullname
        except Employees.DoesNotExist:
            return None


class EmployeeDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeDetails
        fields = [
            'eid', 'fullname', 'initname', 'gender', 'dob', 'maritialstatus', 
            'address', 'country', 'designation', 'employeetype', 'department', 
            'status', 'usertype', 'degree', 'university', 'educationlevel', 
            'startedyear', 'completedyear', 'educationstatus', 'email', 
            'emailtype', 'phone', 'phonetype', 'image'
        ]
        read_only_fields = ['eid']

