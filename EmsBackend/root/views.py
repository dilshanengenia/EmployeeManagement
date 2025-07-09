from django.shortcuts import render
from django.db.models import Count, Sum, Q
from .models import (Departments, EmployeeEducation, EmployeeEmails, EmployeePhones, 
                   Users, Salary, SalaryPayments, BankAccountDetails, TrainingBudget, TrainingRequest, UserTypes,
                   LeaveType, EmployeeLeaveBalance, LeaveApplications, ResourceAllocation, EmployeeDetails)
from .serializers import (DepartmentsSerializer, EmployeeEducationSerializer, 
                        EmployeeEmailsSerializer, EmployeePhonesSerializer, UsersSerializer,
                        SalarySerializer, SalaryPaymentsSerializer, BankAccountDetailsSerializer,
                        TrainingBudgetSerializer, TrainingRequestSerializer,
                        LeaveTypeSerializer, EmployeeLeaveBalanceSerializer, LeaveApplicationsSerializer,
                        ResourceAllocationSerializer, EmployeeDetailsSerializer)
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from datetime import date, datetime, timedelta

# Create your views here.

# Dashboard Statistics
@api_view(['GET'])
def dashboard_statistics(request):
    """
    Get dashboard statistics including total employees, departments, salaries, and summaries
    """
    try:
        # Total employees
        total_employees = EmployeeDetails.objects.count()
        
        # Total departments
        total_departments = Departments.objects.count()
        
        # Total salaries (sum of all net salaries)
        total_salaries = Salary.objects.aggregate(
            total=Sum('netsalary')
        )['total'] or 0
        
        # Active employees
        active_employees = EmployeeDetails.objects.filter(status='Active').count()
        
        # Leave summary
        # Get current year for leave statistics
        current_year = datetime.now().year
        current_date = datetime.now().date()
        
        # Total leave applications this year
        total_leave_applications = LeaveApplications.objects.count()
        pending_leaves = LeaveApplications.objects.filter(status='Pending').count()
        approved_leaves = LeaveApplications.objects.filter(status='Approved').count()
        rejected_leaves = LeaveApplications.objects.filter(status='Rejected').count()
        
        # Resource summary
        total_resources = ResourceAllocation.objects.count()
        allocated_resources = ResourceAllocation.objects.filter(
            collecteddate__isnull=True
        ).count()
        returned_resources = ResourceAllocation.objects.filter(
            collecteddate__isnull=False
        ).count()
        
        # Training summary
        total_training_budgets = TrainingBudget.objects.count()
        total_training_requests = TrainingRequest.objects.count()
        pending_training_requests = TrainingRequest.objects.filter(status='Pending').count()
        approved_training_requests = TrainingRequest.objects.filter(status='Approved').count()
        
        # Calculate total budget amount
        total_budget_amount = TrainingBudget.objects.aggregate(
            total=Sum('trainingbudgetamount')
        )['total'] or 0
        
        # Calculate remaining budget
        remaining_budget = TrainingBudget.objects.aggregate(
            total=Sum('remainingamount')
        )['total'] or 0
        
        # Recent activities (last 30 days)
        thirty_days_ago = current_date - timedelta(days=30)
        recent_leave_applications = LeaveApplications.objects.filter(
            fromdate__gte=thirty_days_ago
        ).count()
        
        recent_salary_payments = SalaryPayments.objects.filter(
            paiddate__gte=thirty_days_ago
        ).count()
        
        dashboard_data = {
            'total_employees': total_employees,
            'active_employees': active_employees,
            'total_departments': total_departments,
            'total_salaries': float(total_salaries),
            'leave_summary': {
                'total_applications': total_leave_applications,
                'pending': pending_leaves,
                'approved': approved_leaves,
                'rejected': rejected_leaves,
                'recent_applications': recent_leave_applications
            },
            'resource_summary': {
                'total_resources': total_resources,
                'allocated': allocated_resources,
                'returned': returned_resources
            },
            'training_summary': {
                'total_budgets': total_training_budgets,
                'total_requests': total_training_requests,
                'pending_requests': pending_training_requests,
                'approved_requests': approved_training_requests,
                'total_budget_amount': float(total_budget_amount),
                'remaining_budget': float(remaining_budget)
            },
            'recent_activities': {
                'recent_leave_applications': recent_leave_applications,
                'recent_salary_payments': recent_salary_payments
            }
        }
        
        return Response(dashboard_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch dashboard statistics: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# Authentication function
@api_view(['POST'])
def user_login(request):
    """
    Authenticate user and return user details with role information
    """
    if request.method == 'POST':
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response({'success': False, 'message': 'Email and password are required'}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Find user by email
            user = Users.objects.get(email=email)
            
            # Check password (in production, use proper password hashing)
            if user.password == password:
                # Get user type
                user_type = UserTypes.objects.get(urid=user.urid)
                
                return Response({
                    'success': True,
                    'user': {
                        'email': user.email,
                        'eid': user.eid,
                        'role': user_type.usertype,
                        'roleId': user.urid,
                        'fullName': user.email.split('@')[0]  # Use email prefix as name for now
                    }
                }, status=status.HTTP_200_OK)
            else:
                return Response({'success': False, 'message': 'Invalid credentials'}, 
                                status=status.HTTP_401_UNAUTHORIZED)
                
        except Users.DoesNotExist:
            return Response({'success': False, 'message': 'User not found'}, 
                            status=status.HTTP_404_NOT_FOUND)
        except UserTypes.DoesNotExist:
            return Response({'success': False, 'message': 'User role not found'}, 
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({'success': False, 'message': str(e)}, 
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Department related functions
@api_view(['GET', 'POST'])
def departments(request):
    if request.method == 'GET':
        # get all departments
        departments = Departments.objects.all()
        serializer = DepartmentsSerializer(departments, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        # add a new department
        serializer = DepartmentsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def department_details(request, dno):
    try:
        department = Departments.objects.get(dno=dno)
    except Departments.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        # get single department
        serializer = DepartmentsSerializer(department)
        return Response(serializer.data)  
    if request.method == 'PUT':
        # update a department
        serializer = DepartmentsSerializer(department, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    if request.method == 'DELETE':
        # Delete a department
        department.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# Employee Details related functions
@api_view(['GET', 'POST'])
def employee_details_list(request):
    """
    List all employee details or create a new employee detail record
    """
    if request.method == 'GET':
        # Get all employee details
        employee_details = EmployeeDetails.objects.all()
        serializer = EmployeeDetailsSerializer(employee_details, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        # Create a new employee detail record
        serializer = EmployeeDetailsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def employee_details_detail(request, eid):
    """
    Retrieve, update or delete an employee detail record
    """
    try:
        employee_detail = EmployeeDetails.objects.get(eid=eid)
    except EmployeeDetails.DoesNotExist:
        return Response({'error': 'Employee details not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        # Get single employee detail
        serializer = EmployeeDetailsSerializer(employee_detail)
        return Response(serializer.data)
    elif request.method == 'PUT':
        # Update employee detail
        serializer = EmployeeDetailsSerializer(employee_detail, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        # Delete employee detail
        employee_detail.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# Legacy Employee related functions - Kept for compatibility
@api_view(['GET', 'POST'])
def employees(request):
    # Return empty response since employees table doesn't exist
    if request.method == 'GET':
        return Response([])
    elif request.method == 'POST':
        return Response({"error": "Employees table not available"}, 
                      status=status.HTTP_501_NOT_IMPLEMENTED)
    
@api_view(['GET', 'PUT', 'DELETE'])
def employees_details(request, eid):
    return Response({"error": "Employees table not available"}, 
                  status=status.HTTP_501_NOT_IMPLEMENTED)
    


# Employee education related functions
@api_view(['GET', 'POST'])
def employees_education(request):
    if request.method == 'GET':
        eid = request.query_params.get("eid")
        if eid:
            # get education for a specific employee
            employees_education = EmployeeEducation.objects.filter(eid=eid)
        else:
            # get all employees education
            employees_education = EmployeeEducation.objects.all()
        serializer = EmployeeEducationSerializer(employees_education, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        # add a new employee education
        serializer = EmployeeEducationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  
    

@api_view(['GET', 'PUT', 'DELETE'])
def employees_education_details(request, eid, eduid):
    try:
        employee_education = EmployeeEducation.objects.get(eid=eid,id=eduid)
    except EmployeeEducation.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        # get single employee education
        serializer = EmployeeEducationSerializer(employee_education)
        return Response(serializer.data)  
    if request.method == 'PUT':
        # update a employee education
        serializer = EmployeeEducationSerializer(employee_education, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    if request.method == 'DELETE':
        # Delete a employee education
        employee_education.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    



# Employee email related functions
@api_view(['GET', 'POST'])
def employees_email(request):
    if request.method == 'GET':
        eid = request.query_params.get("eid")
        if eid:
            # get emails for a sepcific employee
            employees_email = EmployeeEmails.objects.filter(eid=eid)
        else:
            # get all employees email
            employees_email = EmployeeEmails.objects.all()
        serializer = EmployeeEmailsSerializer(employees_email, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        # add a new employee email
        serializer = EmployeeEmailsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  
    

@api_view(['GET', 'PUT', 'DELETE'])
def employees_email_details(request, eid, email):
    try:
        employee_email = EmployeeEmails.objects.get(eid=eid, email=email)
    except EmployeeEmails.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        # get single employee email
        serializer = EmployeeEmailsSerializer(employee_email)
        return Response(serializer.data)  
    if request.method == 'PUT':
        # update a employee email
        serializer = EmployeeEmailsSerializer(employee_email, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    if request.method == 'DELETE':
        # Delete a employee email
        employee_email.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

# Employee phone related functions
@api_view(['GET', 'POST'])
def employees_phone(request):
    if request.method == 'GET':
        eid = request.query_params.get("eid")
        if eid:
            # get phones for a sepcific employee
            employees_phone = EmployeePhones.objects.filter(eid=eid)
        else:
            # get all employees phone
            employees_phone = EmployeePhones.objects.all()
        serializer = EmployeePhonesSerializer(employees_phone, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        # add a new employee phone
        serializer = EmployeePhonesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  
    

@api_view(['GET', 'PUT', 'DELETE'])
def employees_phone_details(request, eid, phoneno):
    try:
        employee_phone = EmployeePhones.objects.get(eid=eid, phoneno=phoneno)
    except EmployeePhones.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        # get single employee phone 
        serializer = EmployeePhonesSerializer(employee_phone)
        return Response(serializer.data)  
    if request.method == 'PUT':
        # update a employee phone 
        serializer = EmployeePhonesSerializer(employee_phone, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    if request.method == 'DELETE':
        # Delete a employee phone
        employee_phone.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

# User related functions
@api_view(['GET', 'POST'])
def employees_user(request):
    if request.method == 'GET':
        eid = request.query_params.get("eid")
        if eid:
            # get user accounts for for a sepcific employee
            employees_user = Users.objects.filter(eid=eid)
        else:
            # get all employees phone
            employees_user = Users.objects.all()
        serializer = UsersSerializer(employees_user, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        # add a new employee phone
        serializer = UsersSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  
    

@api_view(['GET', 'PUT', 'DELETE'])
def employees_user_details(request, eid, email):
    try:
        employee_user = Users.objects.get(eid=eid, email=email)
    except Users.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        # get single employee phone
        serializer = UsersSerializer(employee_user)
        return Response(serializer.data)  
    if request.method == 'PUT':
        # update a employee phone
        serializer = UsersSerializer(employee_user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    if request.method == 'DELETE':
        # Delete a employee phone
        employee_user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# Salary related functions
@api_view(['GET', 'POST'])
def employee_salary(request):
    if request.method == 'GET':
        # get all salary records
        salaries = Salary.objects.all()
        serializer = SalarySerializer(salaries, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        # add a new salary record
        data = request.data.copy()
        
        # Calculate EPF and ETF values if they're not provided
        try:
            basic_salary = float(data.get('basicsalary', 0))
            
            # Add EPF employee (8% of basic salary) if not present
            if 'epf_employee' not in data or not data['epf_employee']:
                data['epf_employee'] = "{:.2f}".format(basic_salary * 0.08)
                
            # Add EPF employer (12% of basic salary) if not present
            if 'epf_employer' not in data or not data['epf_employer']:
                data['epf_employer'] = "{:.2f}".format(basic_salary * 0.12)
                
            # Add ETF employer (3% of basic salary) if not present
            if 'etf_employer' not in data or not data['etf_employer']:
                data['etf_employer'] = "{:.2f}".format(basic_salary * 0.03)
                
        except Exception as e:
            # Log any errors but proceed with the request
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error pre-calculating EPF/ETF values: {str(e)}")
        
        serializer = SalarySerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def employee_salary_details(request, eid):
    try:
        salary = Salary.objects.get(eid=eid)
    except Salary.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        # get single salary record
        serializer = SalarySerializer(salary)
        return Response(serializer.data)  
    if request.method == 'PUT':
        # update a salary record
        data = request.data.copy()
        
        # Calculate EPF and ETF values if they're not provided
        try:
            basic_salary = float(data.get('basicsalary', salary.basicsalary or 0))
            
            # Add EPF employee (8% of basic salary) if not present
            if 'epf_employee' not in data or not data['epf_employee']:
                data['epf_employee'] = "{:.2f}".format(basic_salary * 0.08)
                
            # Add EPF employer (12% of basic salary) if not present
            if 'epf_employer' not in data or not data['epf_employer']:
                data['epf_employer'] = "{:.2f}".format(basic_salary * 0.12)
                
            # Add ETF employer (3% of basic salary) if not present
            if 'etf_employer' not in data or not data['etf_employer']:
                data['etf_employer'] = "{:.2f}".format(basic_salary * 0.03)
                
        except Exception as e:
            # Log any errors but proceed with the request
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error pre-calculating EPF/ETF values: {str(e)}")
        
        serializer = SalarySerializer(salary, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    if request.method == 'DELETE':
        # Delete a salary record
        salary.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
def salary_payments(request):
    if request.method == 'GET':
        try:
            # Use raw SQL to avoid Django ORM's automatic id field
            from django.db import connection
            
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT Eid, Salary, PaidDate 
                    FROM salarypayments
                    ORDER BY Eid
                """)
                
                # Format the data for the frontend
                result = []
                for row in cursor.fetchall():
                    employee_id = row[0]  # Eid
                    salary = row[1]       # Salary
                    paid_date = row[2]    # PaidDate
                    
                    # Create an ID for frontend reference
                    payment_id = f"{employee_id}_unknown"
                    date_str = ""
                    
                    if paid_date:
                        try:
                            payment_id = f"{employee_id}_{paid_date.strftime('%Y%m%d')}"
                            date_str = paid_date.isoformat()
                        except:
                            pass
                    
                    # Format the salary with 2 decimal places
                    try:
                        salary_value = float(salary) if salary else 0
                        salary_formatted = "{:.2f}".format(salary_value)
                    except:
                        salary_formatted = "0.00"
                    
                    # Create the payment record
                    payment_record = {
                        "id": payment_id,
                        "eid": employee_id,
                        "salary": salary_formatted,
                        "paiddate": date_str
                    }
                    
                    result.append(payment_record)
            
            return Response(result)
        except Exception as e:
            # Log the error
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error fetching salary payments: {str(e)}")
            return Response({"error": f"Server error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    elif request.method == 'POST':
        try:
            # Add a new salary payment record
            serializer = SalaryPaymentsSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Log the error
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error creating salary payment: {str(e)}")
            return Response({"error": f"Server error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PUT', 'DELETE'])
def salary_payment_details(request, eid, date=None):
    # Log request for debugging
    import logging
    logger = logging.getLogger(__name__)
    logger.info(f"Accessing payment details with eid={eid}, date={date}")
    
    try:
        # Get date from query params if not in URL path
        if date is None and request.GET.get('date'):
            date = request.GET.get('date')
            
        # Check if eid contains the composite key format (eid_date)
        if "_" in str(eid) and date is None:
            parts = str(eid).split("_")
            if len(parts) == 2:
                # Extract employee ID and date from the composite key
                emp_id = parts[0]
                
                if parts[1] == "unknown":
                    # Find the first payment for this employee
                    payment = SalaryPayments.objects.filter(eid=emp_id).order_by('-paiddate').first()
                    if not payment:
                        return Response({"error": f"No payment found for employee {emp_id}"}, status=status.HTTP_404_NOT_FOUND)
                else:
                    try:
                        # Try to parse the date from YYYYMMDD format
                        year = int(parts[1][:4])
                        month = int(parts[1][4:6])
                        day = int(parts[1][6:8])
                        from datetime import date as dt_date
                        parsed_date = dt_date(year, month, day)
                        
                        # Get the payment record
                        payment = SalaryPayments.objects.get(eid=emp_id, paiddate=parsed_date)
                    except (ValueError, IndexError):
                        return Response({"error": f"Invalid payment ID format: {eid}"}, status=status.HTTP_400_BAD_REQUEST)
                    except SalaryPayments.DoesNotExist:
                        return Response({"error": f"No payment found with ID {eid}"}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({"error": f"Invalid payment ID format: {eid}"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            if date:
                # Query by both employee ID and date
                payment = SalaryPayments.objects.get(eid=eid, paiddate=date)
            else:
                # Just get the first payment for this employee
                payment = SalaryPayments.objects.filter(eid=eid).first()
                if not payment:
                    return Response({"error": f"No payment found for employee {eid}"}, status=status.HTTP_404_NOT_FOUND)
                
        # Process the request based on HTTP method
        if request.method == 'GET':
            # Get single salary payment record
            serializer = SalaryPaymentsSerializer(payment)
            return Response(serializer.data)  
            
        elif request.method == 'PUT':
            # Update a salary payment record
            serializer = SalaryPaymentsSerializer(payment, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        elif request.method == 'DELETE':
            # Delete a salary payment record
            payment.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
            
    except SalaryPayments.DoesNotExist:
        return Response({"error": "Payment record not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error in salary_payment_details: {str(e)}")
        return Response({"error": f"Server error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def employee_payments(request, eid):
    """Get all salary payments for a specific employee"""
    try:
        payments = SalaryPayments.objects.filter(eid=eid)
        serializer = SalaryPaymentsSerializer(payments, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def mass_salary_payment(request):
    """Process salary payments for multiple employees at once"""
    employee_ids = request.data.get('employee_ids', None)  # Optional list of employee IDs
    payment_date_str = request.data.get('payment_date', None)  # Optional payment date
    
    try:
        # Convert payment date string to date object if provided
        if payment_date_str:
            payment_date = date.fromisoformat(payment_date_str)
        else:
            payment_date = date.today()
            
        success_count = 0
        failed_list = []
        total_amount = 0
        
        # If no specific employees are provided, get all employees with salary records
        if employee_ids is None:
            salary_records = Salary.objects.all()
            employee_ids = [s.eid.eid for s in salary_records]
        
        # Process each employee
        for eid in employee_ids:
            try:
                # Get the employee's salary record
                salary_record = Salary.objects.get(eid=eid)
                
                # Check if payment already exists for this date
                existing_payment = SalaryPayments.objects.filter(
                    eid=salary_record.eid,
                    paiddate=payment_date
                ).first()
                
                if existing_payment:
                    failed_list.append({
                        'eid': eid,
                        'error': 'Payment already exists for this date'
                    })
                    continue
                
                # Create the payment record
                payment = SalaryPayments(
                    eid=salary_record.eid,
                    salary=salary_record.netsalary,
                    paiddate=payment_date
                )
                payment.save()
                
                # Update statistics
                success_count += 1
                total_amount += float(salary_record.netsalary)
                
            except Salary.DoesNotExist:
                # No salary record for this employee
                failed_list.append({
                    'eid': eid,
                    'error': 'No salary record found for this employee'
                })
            except Exception as e:
                # Record failed payments
                failed_list.append({
                    'eid': eid,
                    'error': str(e)
                })
        
        if success_count > 0:
            response_status = status.HTTP_200_OK
        else:
            response_status = status.HTTP_400_BAD_REQUEST
            
        return Response({
            'success': success_count > 0,
            'success_count': success_count,
            'failed_count': len(failed_list),
            'failed_payments': failed_list,
            'total_amount': total_amount,
            'payment_date': payment_date.isoformat()
        }, status=response_status)
        
    except Exception as e:
        # Log the error
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error in mass_salary_payment: {str(e)}")
        
        return Response({
            'success': False,
            'message': f"Server error: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Bank Account Details related functions
@api_view(['GET', 'POST'])
def bank_account_details(request):
    """Get all bank account details or add a new one"""
    if request.method == 'GET':
        try:
            # Get all bank account records
            accounts = BankAccountDetails.objects.all()
            serializer = BankAccountDetailsSerializer(accounts, many=True)
            return Response(serializer.data)
        except Exception as e:
            # Log the error
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error fetching bank account details: {str(e)}")
            return Response({"error": f"Server error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    elif request.method == 'POST':
        try:
            # Add a new bank account detail record
            data = request.data.copy()  # Create a mutable copy of the data
            serializer = BankAccountDetailsSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Log the error
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error creating bank account detail: {str(e)}")
            return Response({"error": f"Server error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PUT', 'DELETE'])
def bank_account_detail(request, eid):
    """Get, update or delete a specific bank account detail"""
    try:
        # Get the bank account detail
        account = BankAccountDetails.objects.get(eid=eid)
    except BankAccountDetails.DoesNotExist:
        return Response({"error": f"No bank account found for employee {eid}"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error fetching bank account detail: {str(e)}")
        return Response({"error": f"Server error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    if request.method == 'GET':
        # Get single bank account detail
        serializer = BankAccountDetailsSerializer(account)
        return Response(serializer.data)
        
    elif request.method == 'PUT':
        # Update bank account detail
        data = request.data.copy()  # Create a mutable copy of the data
        serializer = BankAccountDetailsSerializer(account, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    elif request.method == 'DELETE':
        # Delete bank account detail
        account.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# Training Budget related functions
@api_view(['GET', 'POST'])
def training_budgets(request):
    """Get all training budgets or add a new one"""
    if request.method == 'GET':
        try:
            # Get all training budgets using Django ORM
            budgets = TrainingBudget.objects.all()
            serializer = TrainingBudgetSerializer(budgets, many=True)
            return Response(serializer.data)
        except Exception as e:
            # Log the error
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error fetching training budgets: {str(e)}")
            return Response({"error": f"Server error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    elif request.method == 'POST':
        try:
            # Add a new training budget record using Django ORM
            serializer = TrainingBudgetSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            # Log the error
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error creating training budget: {str(e)}")
            return Response({"error": f"Server error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PUT', 'DELETE'])
def training_budget_detail(request, eid):
    """Get, update or delete a specific training budget"""
    try:
        # Get the training budget
        budget = TrainingBudget.objects.get(eid=eid)
    except TrainingBudget.DoesNotExist:
        return Response({"error": f"No training budget found for employee {eid}"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error fetching training budget: {str(e)}")
        return Response({"error": f"Server error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    if request.method == 'GET':
        # Get single training budget
        serializer = TrainingBudgetSerializer(budget)
        return Response(serializer.data)
        
    elif request.method == 'PUT':
        # Update training budget
        serializer = TrainingBudgetSerializer(budget, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    elif request.method == 'DELETE':
        # Delete training budget
        budget.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# Training Request related functions
@api_view(['GET', 'POST'])
def training_requests(request):
    """Get all training requests or add a new one"""
    if request.method == 'GET':
        try:
            # Use raw SQL to avoid Django ORM issues with the table structure
            from django.db import connection
            
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT Eid, RequestedAmount, Reason, AppliedDate, Status, GrantedDate, ProofDocumentUrl
                    FROM trainingbudgetallocation
                """)
                
                columns = [col[0] for col in cursor.description]
                result = []
                
                for row in cursor.fetchall():
                    # Create a dict from column names and values
                    item = dict(zip(columns, row))
                    
                    # Create a virtual ID for frontend compatibility
                    item['id'] = f"tr_{item['Eid']}"
                    
                    # Format dates for consistency
                    if item['AppliedDate']:
                        item['AppliedDate'] = item['AppliedDate'].isoformat()
                    
                    if item['GrantedDate']:
                        item['GrantedDate'] = item['GrantedDate'].isoformat()
                    
                    result.append(item)
            
            # Convert dict keys to lowercase to match serializer field names
            formatted_result = []
            for item in result:
                formatted_item = {k.lower(): v for k, v in item.items()}
                formatted_result.append(formatted_item)
                
            return Response(formatted_result)
            
        except Exception as e:
            # Log the error with detailed information
            import logging
            import traceback
            logger = logging.getLogger(__name__)
            logger.error(f"Error fetching training requests: {str(e)}")
            logger.error(f"Traceback: {traceback.format_exc()}")
            return Response({"error": f"Server error: {str(e)}", "details": traceback.format_exc()}, 
                           status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    elif request.method == 'POST':
        try:
            # Extract data from request
            data = request.data.copy()
            
            # Add a new training request using raw SQL
            from django.db import connection
            
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO trainingbudgetallocation 
                    (Eid, RequestedAmount, Reason, AppliedDate, Status, GrantedDate, ProofDocumentUrl)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, [
                    data.get('eid'),
                    data.get('requestedamount'),
                    data.get('reason'),
                    data.get('applieddate'),
                    data.get('status', 'Pending'),
                    data.get('granteddate'),
                    data.get('proofdocumenturl')
                ])
            
            # Return the created data
            data['id'] = f"tr_{data.get('eid')}"
            return Response(data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            # Log the error with detailed information
            import logging
            import traceback
            logger = logging.getLogger(__name__)
            logger.error(f"Error creating training request: {str(e)}")
            logger.error(f"Traceback: {traceback.format_exc()}")
            return Response({"error": f"Server error: {str(e)}", "details": traceback.format_exc()}, 
                           status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PUT', 'DELETE'])
def training_request_detail(request, id):
    """Get, update or delete a specific training request"""
    try:
        import logging
        logger = logging.getLogger(__name__)
        
        # Log the incoming request ID for debugging
        logger.info(f"Training request detail accessed with ID: {id}")
        
        # Parse the virtual ID to get the employee ID
        if id.startswith('tr_'):
            eid = id.split('_')[1]
        else:
            eid = id
            
        logger.info(f"Parsed employee ID from request: {eid}")
            
        # Use raw SQL to get the training request
        from django.db import connection
        with connection.cursor() as cursor:
            query = """
                SELECT Eid, RequestedAmount, Reason, AppliedDate, Status, GrantedDate, ProofDocumentUrl
                FROM trainingbudgetallocation
                WHERE Eid = %s
            """
            logger.info(f"Executing SQL query: {query} with parameter {eid}")
            
            cursor.execute(query, [eid])
            
            columns = [col[0] for col in cursor.description]
            row = cursor.fetchone()
            
            if not row:
                logger.error(f"No training request found with Eid={eid}")
                return Response({"error": f"No training request found with ID {id}"}, 
                               status=status.HTTP_404_NOT_FOUND)
                
            # Create a dict from column names and values
            training_request = dict(zip(columns, row))
            
            # Add a virtual ID for frontend compatibility
            training_request['id'] = f"tr_{training_request['Eid']}"
            logger.info(f"Created virtual ID: {training_request['id']}")
            
            # Format dates for consistency
            if training_request['AppliedDate']:
                training_request['AppliedDate'] = training_request['AppliedDate'].isoformat()
            
            if training_request['GrantedDate']:
                training_request['GrantedDate'] = training_request['GrantedDate'].isoformat()
        
    except Exception as e:
        import logging
        import traceback
        logger = logging.getLogger(__name__)
        logger.error(f"Error fetching training request: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        return Response({"error": f"Server error: {str(e)}", "details": traceback.format_exc()}, 
                       status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    if request.method == 'GET':
        # Convert dict keys to lowercase to match serializer field names
        formatted_request = {k.lower(): v for k, v in training_request.items()}
        return Response(formatted_request)
        
    elif request.method == 'PUT':
        try:
            # Import modules
            import logging
            import traceback
            from datetime import date
            logger = logging.getLogger(__name__)
            
            # Log the received data for debugging
            logger.info(f"Updating training request {id} with data: {request.data}")
            
            # Extract data from request
            data = request.data.copy()
            
            # Log all data fields for debugging
            for key, value in data.items():
                logger.info(f"Request field {key}: {value}")
            
            # Convert keys to case-insensitive access
            data_ci = {k.lower(): v for k, v in data.items()}
            
            # Check if status is being updated and log it
            if 'status' in data_ci:
                current_status = training_request['Status']
                new_status = data_ci['status']
                logger.info(f"Status change for request {id}: {current_status} -> {new_status}")
                
                # Automatically set granteddate if status changes to Approved
                if new_status == 'Approved' and (not training_request['GrantedDate'] or training_request['GrantedDate'] == 'null'):
                    if 'granteddate' not in data_ci or not data_ci['granteddate']:
                        today_date = date.today().isoformat()
                        data_ci['granteddate'] = today_date
                        logger.info(f"Setting granted date to today: {today_date}")
            
            # Update the training request using raw SQL
            from django.db import connection
            
            # Make sure we have valid SQL parameters by prioritizing user input with defaults from database
            requested_amount = data_ci.get('requestedamount', training_request['RequestedAmount'])
            reason = data_ci.get('reason', training_request['Reason'])
            status_value = data_ci.get('status', training_request['Status'])
            
            # Parse dates and handle null values properly
            applied_date = data_ci.get('applieddate', training_request['AppliedDate'])
            if applied_date == 'null' or applied_date is None:
                applied_date = None
                
            granted_date = data_ci.get('granteddate', training_request['GrantedDate'])
            if granted_date == 'null' or granted_date is None:
                granted_date = None
                
            # Handle proof document URL
            proof_url = data_ci.get('proofdocumenturl', training_request['ProofDocumentUrl'])
            if proof_url == 'null':
                proof_url = None
                
            # Log all parameters being used for update
            logger.info(f"Update parameters - Amount: {requested_amount}, Reason: {reason}, Status: {status_value}")
            logger.info(f"Update parameters - Applied date: {applied_date}, Granted date: {granted_date}")
            
            # Build and execute the SQL UPDATE query
            with connection.cursor() as cursor:
                logger.info(f"Executing UPDATE query for Eid={eid}")
                cursor.execute("""
                    UPDATE trainingbudgetallocation
                    SET RequestedAmount = %s,
                        Reason = %s,
                        AppliedDate = %s,
                        Status = %s,
                        GrantedDate = %s,
                        ProofDocumentUrl = %s
                    WHERE Eid = %s
                """, [
                    requested_amount,
                    reason,
                    applied_date,
                    status_value,
                    granted_date,
                    proof_url,
                    eid
                ])
                
                # Check if any rows were affected
                rows_affected = cursor.rowcount
                logger.info(f"Update affected {rows_affected} rows")
                
                if rows_affected == 0:
                    # No rows were updated, this might indicate a problem
                    logger.warning(f"Update query did not affect any rows for Eid={eid}")
                    
                    # Verify if the record exists
                    cursor.execute("SELECT COUNT(*) FROM trainingbudgetallocation WHERE Eid = %s", [eid])
                    count = cursor.fetchone()[0]
                    
                    if count == 0:
                        logger.error(f"Record with Eid={eid} does not exist in trainingbudgetallocation table")
                        return Response(
                            {"error": f"Training request with ID {id} not found"}, 
                            status=status.HTTP_404_NOT_FOUND
                        )
            
            # Helper function to safely format dates
            def format_date(date_value):
                if date_value is None:
                    return None
                if isinstance(date_value, str):
                    return date_value
                try:
                    return date_value.isoformat()
                except:
                    logger.error(f"Error formatting date: {date_value}")
                    return str(date_value)
            
            # Return the updated data with correct format
            updated_data = {
                'id': f"tr_{eid}",
                'eid': eid,
                'requestedamount': str(requested_amount),
                'reason': reason,
                'applieddate': format_date(applied_date),
                'status': status_value,
                'granteddate': format_date(granted_date),
                'proofdocumenturl': proof_url
            }
            
            logger.info(f"Returning updated data: {updated_data}")
            return Response(updated_data, status=status.HTTP_200_OK)
            
        except Exception as e:
            import logging
            import traceback
            logger = logging.getLogger(__name__)
            logger.error(f"Error updating training request: {str(e)}")
            logger.error(f"Traceback: {traceback.format_exc()}")
            return Response({"error": f"Server error: {str(e)}", "details": traceback.format_exc()}, 
                          status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    elif request.method == 'DELETE':
        try:
            # Delete the training request using raw SQL
            from django.db import connection
            
            with connection.cursor() as cursor:
                cursor.execute("""
                    DELETE FROM trainingbudgetallocation
                    WHERE Eid = %s
                """, [eid])
            
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            import logging
            import traceback
            logger = logging.getLogger(__name__)
            logger.error(f"Error deleting training request: {str(e)}")
            logger.error(f"Traceback: {traceback.format_exc()}")
            return Response({'error': 'An error occurred while deleting the training request'}, 
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Leave related functions
@api_view(['GET', 'POST'])
def leave_types(request):
    """Get all leave types or add a new leave type"""
    if request.method == 'GET':
        try:
            leave_types = LeaveType.objects.all()
            serializer = LeaveTypeSerializer(leave_types, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'POST':
        try:
            serializer = LeaveTypeSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PUT', 'DELETE'])
def leave_type_details(request, lid):
    """Get, update or delete a specific leave type"""
    try:
        leave_type = LeaveType.objects.get(lid=lid)
    except LeaveType.DoesNotExist:
        return Response({'error': 'Leave type not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = LeaveTypeSerializer(leave_type)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'PUT':
        serializer = LeaveTypeSerializer(leave_type, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        leave_type.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
def employee_leave_balances(request):
    """Get all employee leave balances or add/update a new one"""
    if request.method == 'GET':
        try:
            balances = EmployeeLeaveBalance.objects.all()
            serializer = EmployeeLeaveBalanceSerializer(balances, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'POST':
        try:
            serializer = EmployeeLeaveBalanceSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PUT', 'DELETE'])
def employee_leave_balance_details(request, eid):
    """Get, update or delete a specific employee's leave balance"""
    try:
        balance = EmployeeLeaveBalance.objects.get(eid=eid)
    except EmployeeLeaveBalance.DoesNotExist:
        return Response({'error': 'Employee leave balance not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = EmployeeLeaveBalanceSerializer(balance)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'PUT':
        serializer = EmployeeLeaveBalanceSerializer(balance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        balance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


def generate_leave_id():
    """Generate a unique Leave ID"""
    try:
        # Get the count of existing leave applications and increment
        count = LeaveApplications.objects.count()
        new_num = count + 1
        
        # Keep trying until we find a unique ID
        while True:
            new_id = f"L{new_num:03d}"
            if not LeaveApplications.objects.filter(lid=new_id).exists():
                return new_id
            new_num += 1
            
    except Exception:
        # Fallback to timestamp-based ID
        from datetime import datetime
        timestamp = int(datetime.now().timestamp() * 1000) % 100000
        return f"L{timestamp}"


@api_view(['GET', 'POST'])
def leave_applications(request):
    """Get all leave applications or add a new leave application"""
    if request.method == 'GET':
        try:
            applications = LeaveApplications.objects.all()
            serializer = LeaveApplicationsSerializer(applications, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'POST':
        try:
            data = request.data.copy()
            print(f"Received data: {data}")  # Debug log
            
            # Generate a unique Leave ID if not provided
            if 'lid' not in data or not data['lid']:
                data['lid'] = generate_leave_id()
                print(f"Generated lid: {data['lid']}")  # Debug log
            
            # Set default values for status and priority
            if 'status' not in data or not data['status']:
                data['status'] = 'Pending'
            
            if 'priority' not in data or not data['priority']:
                data['priority'] = 'Medium'
            
            print(f"Final data before serialization: {data}")  # Debug log
            
            serializer = LeaveApplicationsSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                print(f"Serializer errors: {serializer.errors}")  # Debug log
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PUT', 'DELETE'])
def leave_application_details(request, app_id):
    """Get, update or delete a specific leave application"""
    print(f"Looking for leave application with lid: {app_id}")  # Debug log
    try:
        application = LeaveApplications.objects.get(lid=app_id)
        print(f"Found application: {application}")  # Debug log
    except LeaveApplications.DoesNotExist:
        print(f"Leave application with lid {app_id} not found")  # Debug log
        return Response({'error': 'Leave application not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = LeaveApplicationsSerializer(application)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'PUT':
        print(f"Updating application with data: {request.data}")  # Debug log
        serializer = LeaveApplicationsSerializer(application, data=request.data)
        if serializer.is_valid():
            serializer.save()
            print(f"Successfully updated application")  # Debug log
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            print(f"Serializer errors in update: {serializer.errors}")  # Debug log
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        application.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# Leave application views for specific employee
@api_view(['GET'])
def employee_leave_applications(request, eid):
    """Get all leave applications for a specific employee"""
    if request.method == 'GET':
        try:
            applications = LeaveApplications.objects.filter(eid=eid)
            serializer = LeaveApplicationsSerializer(applications, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Resource Allocation views
@api_view(['GET', 'POST'])
def resource_allocations(request):
    """
    List all resource allocations or create a new one
    """
    if request.method == 'GET':
        try:
            allocations = ResourceAllocation.objects.all()
            serializer = ResourceAllocationSerializer(allocations, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'POST':
        serializer = ResourceAllocationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def resource_allocation_details(request, allocation_id):
    """
    Retrieve, update or delete a resource allocation
    """
    try:
        allocation = ResourceAllocation.objects.get(allocationid=allocation_id)
    except ResourceAllocation.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = ResourceAllocationSerializer(allocation)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = ResourceAllocationSerializer(allocation, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        allocation.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def employee_resource_allocations(request, eid):
    """
    Get all resource allocations for a specific employee
    """
    if request.method == 'GET':
        try:
            allocations = ResourceAllocation.objects.filter(eid=eid)
            serializer = ResourceAllocationSerializer(allocations, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# User management functions for admin settings
@api_view(['GET', 'POST'])
def users_management(request):
    """
    Get all users or create a new user for admin settings
    """
    if request.method == 'GET':
        # Get all users with their role information
        users = Users.objects.all()
        users_data = []
        
        for user in users:
            try:
                user_type = UserTypes.objects.get(urid=user.urid)
                user_data = {
                    'eid': user.eid,
                    'email': user.email,
                    'password': user.password,
                    'urid': user.urid,
                    'userType': user_type.usertype
                }
                users_data.append(user_data)
            except UserTypes.DoesNotExist:
                user_data = {
                    'eid': user.eid,
                    'email': user.email,
                    'password': user.password,
                    'urid': user.urid,
                    'userType': 'Unknown'
                }
                users_data.append(user_data)
        
        return Response(users_data)
    
    elif request.method == 'POST':
        # Create a new user
        serializer = UsersSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def user_management_details(request, eid):
    """
    Get, update or delete a specific user for admin settings
    """
    try:
        user = Users.objects.get(eid=eid)
    except Users.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        # Get single user with role information
        try:
            user_type = UserTypes.objects.get(urid=user.urid)
            user_data = {
                'eid': user.eid,
                'email': user.email,
                'password': user.password,
                'urid': user.urid,
                'userType': user_type.usertype
            }
        except UserTypes.DoesNotExist:
            user_data = {
                'eid': user.eid,
                'email': user.email,
                'password': user.password,
                'urid': user.urid,
                'userType': 'Unknown'
            }
        return Response(user_data)
    
    elif request.method == 'PUT':
        # Update user
        serializer = UsersSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        # Delete user
        user.delete()
        return Response({'message': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def user_types(request):
    """
    Get all user types for dropdown selection
    """
    user_types = UserTypes.objects.all()
    user_types_data = []
    
    for user_type in user_types:
        user_types_data.append({
            'urid': user_type.urid,
            'userType': user_type.usertype
        })
    
    return Response(user_types_data)