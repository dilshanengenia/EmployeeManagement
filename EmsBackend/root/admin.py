from django.contrib import admin
from  .models import Departments, EmployeeTypes, UserTypes, Employees, EmployeeEducation, EmployeeEmails, EmployeePhones, Users
# Register your models here.


class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['dno', 'dname', 'noofemp', 'dlocation']
    list_filter = ['dlocation']
    search_fields = ['dname', 'dlocation']
    ordering = ['dno']
    list_editable = ['dname', 'noofemp', 'dlocation']
    list_per_page = 20
    
admin.site.register(Departments, DepartmentAdmin)

class EmployeeTypesAdmin(admin.ModelAdmin):
    list_display =  ['etid', 'employeetype']
    
admin.site.register(EmployeeTypes, EmployeeTypesAdmin)

class UserTypesAdmin(admin.ModelAdmin):
    list_display =  ['urid', 'usertype']
    
admin.site.register(UserTypes, UserTypesAdmin)

class EmployeesAdmin(admin.ModelAdmin):
    list_display =  ['eid', 'fullname', 'initname', 'dob', 'gender', 'country', 'address', 'maritialstatus', 'image', 'etid', 'dno', 'designation', 'urid', 'status']
    
admin.site.register(Employees, EmployeesAdmin)

class EmployeeEducationAdmin(admin.ModelAdmin):
    list_display =  ['id', 'eid', 'degree', 'educationlevel', 'university', 'startedyear', 'status', 'completedyear']
    
admin.site.register(EmployeeEducation, EmployeeEducationAdmin)

class EmployeeEmailsAdmin(admin.ModelAdmin):
    list_display =  ['eid', 'emailtype', 'email']
    
admin.site.register(EmployeeEmails, EmployeeEmailsAdmin)

class EmployeePhonesAdmin(admin.ModelAdmin):
    list_display =  ['eid', 'phonetype', 'phoneno']
    
admin.site.register(EmployeePhones, EmployeePhonesAdmin)

class UsersAdmin(admin.ModelAdmin):
    list_display =  ['eid', 'email', 'password', 'urid']
    
admin.site.register(Users, UsersAdmin)
