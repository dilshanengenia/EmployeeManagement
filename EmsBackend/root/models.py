from django.db import models

# Create your models here.

# Departments related models
class Departments(models.Model):
    dno = models.CharField(db_column='department_number', primary_key=True, max_length=3)
    dname = models.CharField(db_column='department_name', max_length=100)
    noofemp = models.IntegerField(db_column='number_of_employees')
    dlocation = models.CharField(db_column='department_location', max_length=100)    
    class Meta:
        managed=False
        db_table='departments'


# Employee related models
class EmployeeTypes(models.Model):
    etid = models.CharField(db_column='Etid',max_length=100, primary_key=True)
    employeetype = models.CharField(db_column='EmployeeType',max_length=100)
    class Meta:
        managed=False
        db_table='employeetypes'
 

class UserTypes(models.Model):
    urid = models.CharField(db_column='Urid',max_length=100, primary_key=True)
    usertype = models.CharField(db_column='UserType',max_length=100)
    class Meta:
        managed=False
        db_table='usertypes'


class Employees(models.Model):

    gender_types = (('Male','Male'),
                  ('Female', 'Female'),
                  ('Other', 'Other'))
    
    maritialstatus_types = (('Single','Single'),
                  ('Married', 'Married'))  

    status_types = (('Active','Active'),
                  ('Suspended', 'Suspended'),
                  ('Retired', 'Retired'),
                  ('Resigned', 'Resigned'),
                  ('Fired', 'Fired'))
    
    eid = models.CharField(db_column='Eid',primary_key=True, max_length=255)
    fullname = models.CharField(db_column='FullName',max_length=255)
    initname =  models.CharField(db_column='InitName',max_length=255)
    dob = models.DateField(db_column='DOB',null=True)
    gender = models.CharField(db_column='Gender', choices=gender_types, max_length=50)
    country = models.CharField(db_column='Country',max_length=100)
    address = models.CharField(db_column='Address',max_length=500)
    maritialstatus = models.CharField(db_column='MaritialStatus',choices=maritialstatus_types, max_length=50)
    image = models.CharField(db_column='Image',max_length=1500)
    etid = models.ForeignKey(EmployeeTypes, on_delete=models.CASCADE, db_column='Etid')
    dno = models.ForeignKey(Departments, on_delete=models.CASCADE, db_column='Dno')
    designation = models.CharField(db_column='Designation',max_length=50)
    urid = models.ForeignKey(UserTypes, on_delete=models.CASCADE, db_column='Urid')
    status = models.CharField(db_column='Status',choices=status_types, max_length=50)

    class Meta:
        managed=False
        db_table='employees'


class EmployeeEducation(models.Model):

    educationlevel_types = (('Bachelor','Bachelor'),
                  ('Masters', 'Masters'),
                  ('Doctorate', 'Doctorate'))
    
    status_types = (('Completed','Completed'),
                  ('Reading', 'Reading'))
    
    id = models.IntegerField(db_column='Id',primary_key=True)
    eid = models.ForeignKey(Employees, on_delete=models.CASCADE, db_column='Eid')
    degree = models.CharField(db_column='Degree',max_length=255)
    educationlevel = models.CharField(db_column='EducationLevel',choices=educationlevel_types, max_length=50)
    university = models.CharField(db_column='University',max_length=255)
    startedyear = models.IntegerField(db_column='StartedYear',null=True)
    status = models.CharField(db_column='Status',choices=status_types, max_length=50)
    completedyear = models.IntegerField(db_column='CompletedYear',null=True)
    class Meta:
        unique_together = ('eid','degree')
        managed=False
        db_table='employeeeducation'


class EmployeeEmails(models.Model):

    emailtype_types = (('Official','Official'),
                  ('Personal', 'Personal'))
    
    eid = models.ForeignKey(Employees, on_delete=models.CASCADE, db_column='Eid')
    emailtype = models.CharField(db_column='EmailType',choices=emailtype_types, max_length=50)
    email = models.CharField(db_column='Email',max_length=100, primary_key=True)
    class Meta:
        unique_together = ('eid','email')
        managed=False
        db_table='employeeemails'


class EmployeePhones(models.Model):

    phonetype_types = (('Official','Official'),
                  ('Personal', 'Personal'))
    
    eid = models.ForeignKey(Employees, on_delete=models.CASCADE, db_column='Eid')
    phonetype = models.CharField(db_column='PhoneType',choices=phonetype_types, max_length=50)
    phoneno = models.CharField(db_column='PhoneNo',max_length=100, primary_key=True)
    class Meta:
        unique_together = ('eid','phoneno')
        managed=False
        db_table='employeephones'


class Users(models.Model):
    eid = models.IntegerField(db_column='Eid', primary_key=True)
    email = models.CharField(db_column='Email',max_length=100)
    password = models.CharField(db_column='Password',max_length=100)
    urid = models.IntegerField(db_column='Urid')
   
    class Meta:
        managed=False
        db_table='users'


# Salary related models
class Salary(models.Model):
    eid = models.OneToOneField(Employees, on_delete=models.CASCADE, db_column='Eid', primary_key=True)
    basicsalary = models.DecimalField(db_column='BasicSalary', max_digits=10, decimal_places=2, null=True)
    internetchages = models.DecimalField(db_column='InterNetCharges', max_digits=10, decimal_places=2, null=True)
    allowances = models.DecimalField(db_column='Allowances', max_digits=10, decimal_places=2, null=True)
    deductions = models.DecimalField(db_column='Deductions', max_digits=10, decimal_places=2, null=True)
    epf_employee = models.DecimalField(db_column='EPF_Employee', max_digits=10, decimal_places=2, null=True)
    epf_employer = models.DecimalField(db_column='EPF_Employer', max_digits=10, decimal_places=2, null=True)
    etf_employer = models.DecimalField(db_column='ETF_Employer', max_digits=10, decimal_places=2, null=True)
    netsalary = models.DecimalField(db_column='NetSalary', max_digits=10, decimal_places=2, null=True)
    
    class Meta:
        managed=False
        db_table='salary'


class SalaryPayments(models.Model):
    # Use OneToOneField instead of ForeignKey with unique=True
    eid = models.OneToOneField(Employees, on_delete=models.CASCADE, db_column='Eid', primary_key=True)
    salary = models.DecimalField(db_column='Salary', max_digits=10, decimal_places=2, null=True)
    paiddate = models.DateField(db_column='PaidDate', null=True)
    
    class Meta:
        managed=False
        db_table='salarypayments'


class BankAccountDetails(models.Model):
    eid = models.CharField(db_column='Eid', primary_key=True, max_length=100)
    bankaccountholdername = models.CharField(db_column='BankAccountHolderName', max_length=100, null=True)
    bankaccno = models.CharField(db_column='BankAccNo', max_length=30, null=True)
    bankname = models.CharField(db_column='BankName', max_length=100, null=True)
    bankbranchname = models.CharField(db_column='BankBranchName', max_length=100, null=True)
    
    class Meta:
        managed=False
        db_table='bankaccountdetails'


# Training related models
class TrainingBudget(models.Model):
    eid = models.IntegerField(db_column='Eid', primary_key=True)
    trainingbudgetrate = models.DecimalField(db_column='TrainingBudgetRate', max_digits=5, decimal_places=2, null=True)
    trainingbudgetamount = models.DecimalField(db_column='TrainingBudgetAmount', max_digits=10, decimal_places=2, null=True)
    remainingamount = models.DecimalField(db_column='RemainingAmount', max_digits=10, decimal_places=2, null=True)
    
    class Meta:
        managed = False
        db_table = 'training'


class TrainingRequest(models.Model):
    STATUS_CHOICES = [
        ('Approved', 'Approved'),
        ('Pending', 'Pending'),
        ('Rejected', 'Rejected'),
    ]
    
    # Use eid as a primary key but don't allow null values
    eid = models.IntegerField(db_column='Eid', primary_key=True)
    requestedamount = models.DecimalField(db_column='RequestedAmount', max_digits=10, decimal_places=2, null=True)
    reason = models.CharField(db_column='Reason', max_length=255, null=True)
    applieddate = models.DateField(db_column='AppliedDate', null=True)
    status = models.CharField(db_column='Status', max_length=10, choices=STATUS_CHOICES, null=True)
    granteddate = models.DateField(db_column='GrantedDate', null=True)
    proofdocumenturl = models.CharField(db_column='ProofDocumentUrl', max_length=255, null=True)
    
    class Meta:
        managed = False
        db_table = 'trainingbudgetallocation'


# Leave related models
class LeaveType(models.Model):
    lid = models.CharField(db_column='Lid', primary_key=True, max_length=10)
    leavetype = models.CharField(db_column='LeaveType', max_length=50)
    
    class Meta:
        managed = False
        db_table = 'leaves'


class EmployeeLeaveBalance(models.Model):
    eid = models.CharField(db_column='Eid', primary_key=True, max_length=255)
    totalannualleaves = models.IntegerField(db_column='TotalAnnualLeaves', null=True)
    totalcasualleaves = models.IntegerField(db_column='TotalCasualLeaves', null=True)
    annualleavebalance = models.IntegerField(db_column='AnnualLeaveBalance', null=True)
    casualleavebalance = models.IntegerField(db_column='CasualLeaveBalance', null=True)
    
    class Meta:
        managed = False
        db_table = 'leavebalance'


class LeaveApplications(models.Model):
    STATUS_CHOICES = [
        ('Approved', 'Approved'),
        ('Pending', 'Pending'),
        ('Rejected', 'Rejected'),
    ]
    
    PRIORITY_CHOICES = [
        ('High', 'High'),
        ('Medium', 'Medium'),
        ('Low', 'Low'),
    ]
    
    eid = models.CharField(db_column='Eid', max_length=10)
    lid = models.CharField(db_column='Lid', max_length=10, primary_key=True)
    fromdate = models.DateField(db_column='FromDate')
    todate = models.DateField(db_column='ToDate')
    noofdays = models.IntegerField(db_column='NoOfDays')
    description = models.CharField(db_column='Description', max_length=255, null=True)
    status = models.CharField(db_column='Status', max_length=50, choices=STATUS_CHOICES, default='Pending')
    priority = models.CharField(db_column='Priority', max_length=50, choices=PRIORITY_CHOICES, default='Medium')
    
    class Meta:
        managed = False
        db_table = 'leaveapply'


# Resource related models
class ResourceAllocation(models.Model):
    allocationid = models.AutoField(db_column='AllocationID', primary_key=True)
    eid = models.CharField(db_column='Eid', max_length=10)
    rid = models.CharField(db_column='Rid', max_length=10, null=True)
    allocateddate = models.DateField(db_column='AllocatedDate')
    collecteddate = models.DateField(db_column='CollectedDate', null=True)
    useddays = models.IntegerField(db_column='UsedDays', null=True)
    
    class Meta:
        managed = False
        db_table = 'resourceallocation'


# Employee Details model - Comprehensive employee information
class EmployeeDetails(models.Model):
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    ]
    
    MARITAL_STATUS_CHOICES = [
        ('Single', 'Single'),
        ('Married', 'Married'),
        ('Divorced', 'Divorced'),
        ('Widowed', 'Widowed'),
    ]
    
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
        ('Suspended', 'Suspended'),
        ('Terminated', 'Terminated'),
    ]
    
    EDUCATION_LEVEL_CHOICES = [
        ('High School', 'High School'),
        ('Associate Degree', 'Associate Degree'),
        ('Bachelor', 'Bachelor'),
        ('Masters', 'Masters'),
        ('Doctorate', 'Doctorate'),
        ('Other', 'Other'),
    ]
    
    EMAIL_TYPE_CHOICES = [
        ('Official', 'Official'),
        ('Personal', 'Personal'),
    ]
    
    PHONE_TYPE_CHOICES = [
        ('Official', 'Official'),
        ('Personal', 'Personal'),
        ('Mobile', 'Mobile'),
        ('Home', 'Home'),
    ]
    
    EDUCATION_STATUS_CHOICES = [
        ('Completed', 'Completed'),
        ('In Progress', 'In Progress'),
        ('Dropped', 'Dropped'),
    ]
    
    eid = models.CharField(db_column='Eid', primary_key=True, max_length=100)
    fullname = models.CharField(db_column='FullName', max_length=255)
    initname = models.CharField(db_column='InitName', max_length=255, null=True, blank=True)
    gender = models.CharField(db_column='Gender', max_length=10, choices=GENDER_CHOICES)
    dob = models.DateField(db_column='DOB', null=True, blank=True)
    maritialstatus = models.CharField(db_column='MaritialStatus', max_length=20, choices=MARITAL_STATUS_CHOICES)
    address = models.TextField(db_column='Address', null=True, blank=True)
    country = models.CharField(db_column='Country', max_length=100)
    designation = models.CharField(db_column='Designation', max_length=100)
    employeetype = models.CharField(db_column='EmployeeType', max_length=50)
    department = models.CharField(db_column='Department', max_length=100)
    status = models.CharField(db_column='Status', max_length=20, choices=STATUS_CHOICES, default='Active')
    usertype = models.CharField(db_column='UserType', max_length=50)
    degree = models.CharField(db_column='Degree', max_length=255, null=True, blank=True)
    university = models.CharField(db_column='University', max_length=255, null=True, blank=True)
    educationlevel = models.CharField(db_column='EducationLevel', max_length=50, choices=EDUCATION_LEVEL_CHOICES, null=True, blank=True)
    startedyear = models.IntegerField(db_column='StartedYear', null=True, blank=True)
    completedyear = models.IntegerField(db_column='CompletedYear', null=True, blank=True)
    educationstatus = models.CharField(db_column='EducationStatus', max_length=20, choices=EDUCATION_STATUS_CHOICES, null=True, blank=True)
    email = models.EmailField(db_column='Email', max_length=255)
    emailtype = models.CharField(db_column='EmailType', max_length=20, choices=EMAIL_TYPE_CHOICES, default='Official')
    phone = models.CharField(db_column='Phone', max_length=20, null=True, blank=True)
    phonetype = models.CharField(db_column='PhoneType', max_length=20, choices=PHONE_TYPE_CHOICES, null=True, blank=True)
    image = models.CharField(db_column='Image', max_length=1500, null=True, blank=True)
    
    class Meta:
        managed = False
        db_table = 'employeedetails'
    
    def __str__(self):
        return f"{self.eid} - {self.fullname}"