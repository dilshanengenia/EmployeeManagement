from django.urls import path
from . import views

urlpatterns = [
    path("login/", views.user_login, name="user_login"),
    path("dashboard/statistics/", views.dashboard_statistics, name="dashboard_statistics"),
    path("departments/", views.departments, name="departments"),
    path("departments/<int:dno>/", views.department_details, name="department_details"),
    
    # Employee Details Management
    path("employee_details/", views.employee_details_list, name="employee_details_list"),
    path("employee_details/<str:eid>/", views.employee_details_detail, name="employee_details_detail"),
    
    # Legacy employee URLs (kept for compatibility)
    path("employees/", views.employees, name="employees"),
    path("employees/<int:eid>/", views.employees_details, name="employees_details"),
    path("employees_education/", views.employees_education, name="employees_education"),
    path("employees_education/<int:eid>/<int:eduid>/", views.employees_education_details, name="employees_education_details"),
    path("employees_email/", views.employees_email, name="employees_email"),
    path("employees_email/<int:eid>/<str:email>/", views.employees_email_details, name="employees_email_details"),
    path("employees_phone/", views.employees_phone, name="employees_phone"),
    path("employees_phone/<int:eid>/<str:phoneno>/", views.employees_phone_details, name="employees_phone_details"),
    path("employees_user/", views.employees_user, name="employees_user"),
    path("employees_user/<int:eid>/<str:email>/", views.employees_user_details, name="employees_user_details"),
    path("salary/", views.employee_salary, name="employee_salary"),
    path("salary/<int:eid>/", views.employee_salary_details, name="employee_salary_details"),
    path("salary_payments/", views.salary_payments, name="salary_payments"),
    path("salary_payments/<int:eid>/", views.salary_payment_details, name="salary_payment_details"),
    path("salary_payments/<int:eid>/<str:date>/", views.salary_payment_details, name="salary_payment_details_with_date"),
    path("employee_payments/<int:eid>/", views.employee_payments, name="employee_payments"),
    path("mass_payment/", views.mass_salary_payment, name="mass_salary_payment"),
    path("bank_accounts/", views.bank_account_details, name="bank_account_details"),
    path("bank_accounts/<int:eid>/", views.bank_account_detail, name="bank_account_detail"),
    
    # Training budget URLs
    path("training_budgets/", views.training_budgets, name="training_budgets"),
    path("training_budgets/<int:eid>/", views.training_budget_detail, name="training_budget_detail"),
    
    # Training request URLs
    path("training_requests/", views.training_requests, name="training_requests"),
    path("training_requests/<str:id>/", views.training_request_detail, name="training_request_detail"),
    
    # Leave management URLs
    path("leave_types/", views.leave_types, name="leave_types"),
    path("leave_types/<str:lid>/", views.leave_type_details, name="leave_type_details"),
    path("employee_leave_balances/", views.employee_leave_balances, name="employee_leave_balances"),
    path("employee_leave_balances/<str:eid>/", views.employee_leave_balance_details, name="employee_leave_balance_details"),
    path("leave_applications/", views.leave_applications, name="leave_applications"),
    path("leave_applications/<str:app_id>/", views.leave_application_details, name="leave_application_details"),
    path("employee_leave_applications/<str:eid>/", views.employee_leave_applications, name="employee_leave_applications"),
    
    # User management URLs for admin settings
    path("users_management/", views.users_management, name="users_management"),
    path("users_management/<int:eid>/", views.user_management_details, name="user_management_details"),
    path("user_types/", views.user_types, name="user_types"),
    
    # Resource allocation URLs
    path("resource_allocations/", views.resource_allocations, name="resource_allocations"),
    path("resource_allocations/<int:allocation_id>/", views.resource_allocation_details, name="resource_allocation_details"),
    path("employee_resource_allocations/<str:eid>/", views.employee_resource_allocations, name="employee_resource_allocations"),
]