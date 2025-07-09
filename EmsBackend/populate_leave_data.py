import os
import django
import sys

# Add the project root to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'EmsBackend.settings')
django.setup()

from root.models import LeaveType, EmployeeLeaveBalance, LeaveApplications
from datetime import date

def populate_leave_data():
    print("Populating leave data...")
    
    # Leave Types
    leave_types_data = [
        {'lid': 'L001', 'leavetype': 'Annual'},
        {'lid': 'L002', 'leavetype': 'Casual'},
        {'lid': 'L003', 'leavetype': 'Casual'},
        {'lid': 'L004', 'leavetype': 'Annual'},
        {'lid': 'L005', 'leavetype': 'Casual'},
    ]
    
    for lt_data in leave_types_data:
        leave_type, created = LeaveType.objects.get_or_create(
            lid=lt_data['lid'],
            defaults={'leavetype': lt_data['leavetype']}
        )
        if created:
            print(f"Created leave type: {leave_type.lid} - {leave_type.leavetype}")
        else:
            print(f"Leave type already exists: {leave_type.lid} - {leave_type.leavetype}")
    
    # Employee Leave Balances
    leave_balances_data = [
        {'eid': 'E001', 'totalannualleaves': 14, 'totalcasualleaves': 7, 'annualleavebalance': 9, 'casualleavebalance': 5},
        {'eid': 'E002', 'totalannualleaves': 14, 'totalcasualleaves': 7, 'annualleavebalance': 12, 'casualleavebalance': 6},
        {'eid': 'E003', 'totalannualleaves': 14, 'totalcasualleaves': 7, 'annualleavebalance': 10, 'casualleavebalance': 4},
        {'eid': 'E004', 'totalannualleaves': 14, 'totalcasualleaves': 7, 'annualleavebalance': 13, 'casualleavebalance': 7},
        {'eid': 'E005', 'totalannualleaves': 14, 'totalcasualleaves': 7, 'annualleavebalance': 8, 'casualleavebalance': 3},
        {'eid': 'E006', 'totalannualleaves': 14, 'totalcasualleaves': 7, 'annualleavebalance': 9, 'casualleavebalance': 5},
    ]
    
    for lb_data in leave_balances_data:
        balance, created = EmployeeLeaveBalance.objects.get_or_create(
            eid=lb_data['eid'],
            defaults={
                'totalannualleaves': lb_data['totalannualleaves'],
                'totalcasualleaves': lb_data['totalcasualleaves'],
                'annualleavebalance': lb_data['annualleavebalance'],
                'casualleavebalance': lb_data['casualleavebalance']
            }
        )
        if created:
            print(f"Created leave balance for employee: {balance.eid}")
        else:
            print(f"Leave balance already exists for employee: {balance.eid}")
    
    # Leave Applications
    leave_applications_data = [
        {
            'eid': 'E001', 'lid': 'L001', 
            'fromdate': date(2025, 5, 1), 'todate': date(2025, 5, 5),
            'noofdays': 5, 'description': 'Family vacation',
            'applieddate': date(2025, 4, 10), 'status': 'Approved', 'priority': 'High'
        },
        {
            'eid': 'E001', 'lid': 'L004', 
            'fromdate': date(2025, 6, 1), 'todate': date(2025, 6, 3),
            'noofdays': 3, 'description': 'Short holiday',
            'applieddate': date(2025, 5, 15), 'status': 'Pending', 'priority': 'Medium'
        },
        {
            'eid': 'E002', 'lid': 'L002', 
            'fromdate': date(2025, 4, 20), 'todate': date(2025, 4, 21),
            'noofdays': 2, 'description': 'Personal errand',
            'applieddate': date(2025, 4, 15), 'status': 'Pending', 'priority': 'Medium'
        },
        {
            'eid': 'E003', 'lid': 'L003', 
            'fromdate': date(2025, 4, 16), 'todate': date(2025, 4, 18),
            'noofdays': 3, 'description': 'Fever and rest',
            'applieddate': date(2025, 4, 16), 'status': 'Approved', 'priority': 'Low'
        },
        {
            'eid': 'E004', 'lid': 'L005', 
            'fromdate': date(2025, 5, 10), 'todate': date(2025, 5, 20),
            'noofdays': 11, 'description': 'Newborn support',
            'applieddate': date(2025, 4, 20), 'status': 'Rejected', 'priority': 'High'
        },
    ]
    
    for app_data in leave_applications_data:
        application = LeaveApplications.objects.create(
            eid=app_data['eid'],
            lid=app_data['lid'],
            fromdate=app_data['fromdate'],
            todate=app_data['todate'],
            noofdays=app_data['noofdays'],
            description=app_data['description'],
            applieddate=app_data['applieddate'],
            status=app_data['status'],
            priority=app_data['priority']
        )
        print(f"Created leave application for {application.eid}: {application.description}")
    
    print("Leave data population completed!")

if __name__ == '__main__':
    populate_leave_data()
