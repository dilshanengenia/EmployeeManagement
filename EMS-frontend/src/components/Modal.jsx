import React from 'react'
import AddEmployeeForm from './AddEmployeeForm'
import AddDepartmentForm from './AddDepartmentForm'
import AddUserForm from './AddUserForm'
import DeleteForm from './DeleteForm'
import SalaryForm from './SalaryForm'
import SalaryPaymentForm from './SalaryPaymentForm'
import BankAccountForm from './BankAccountForm'
import TrainingBudgetForm from './TrainingBudgetForm'
import TrainingRequestForm from './TrainingRequestForm'
import TrainingBudgetRequestForm from './TrainingBudgetRequestForm'
import LeaveApplicationForm from './LeaveApplicationForm'
import LeaveBalanceForm from './LeaveBalanceForm'
import LeaveTypeForm from './LeaveTypeForm'
import LeaveStatusUpdateForm from './LeaveStatusUpdateForm'

const Modal = ({sidebarToggle, handleIsOpen, modelDetails, selectedObject, onRefresh, onSuccess}) => {

  const addEmployeeForm = modelDetails.component==='AddEmployeeForm'?'AddEmployeeForm':'';
  const addDepartmentForm = modelDetails.component==='AddDepartmentForm'?'AddDepartmentForm':''; 
  const addUserForm = modelDetails.component==='AddUserForm'?'AddUserForm':'';
  const salaryForm = modelDetails.component==='SalaryForm'?'SalaryForm':'';
  const salaryPaymentForm = modelDetails.component==='SalaryPaymentForm'?'SalaryPaymentForm':'';
  const bankAccountForm = modelDetails.component==='BankAccountForm'?'BankAccountForm':'';
  const deleteForm = modelDetails.component==='DeleteForm'?'DeleteForm':'';
  const trainingBudgetForm = modelDetails.component==='TrainingBudgetForm'?'TrainingBudgetForm':'';
  const trainingRequestForm = modelDetails.component==='TrainingRequestForm'?'TrainingRequestForm':'';
  const trainingBudgetRequestForm = modelDetails.component==='TrainingBudgetRequestForm'?'TrainingBudgetRequestForm':'';
  const leaveApplicationForm = modelDetails.component==='LeaveApplicationForm'?'LeaveApplicationForm':'';
  const leaveBalanceForm = modelDetails.component==='LeaveBalanceForm'?'LeaveBalanceForm':'';
  const leaveTypeForm = modelDetails.component==='LeaveTypeForm'?'LeaveTypeForm':'';
  const leaveStatusForm = modelDetails.component==='LeaveStatusUpdateForm'?'LeaveStatusUpdateForm':'';
  
  return (
   <div id="crud-modal" tabIndex="-1" className={`${sidebarToggle ? "ml-20": "ml-36"} flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}>
    <div className="relative p-4 w-full max-w-md max-h-full">
        {/* Modal content */}
        <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {modelDetails.title}
                </h3>
                <button type="button" onClick={handleIsOpen} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                    <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span className="sr-only">Close modal</span>
                </button>
            </div>
            {/* Modal body */}
            {addEmployeeForm && <AddEmployeeForm buttonName={modelDetails.buttonName} selectedObject={selectedObject} />}
            {addDepartmentForm && <AddDepartmentForm buttonName={modelDetails.buttonName} selectedObject={selectedObject} onSuccess={onSuccess} />}
            {addUserForm && <AddUserForm buttonName={modelDetails.buttonName} selectedObject={selectedObject} onSubmit={onRefresh} onClose={handleIsOpen} />}
            {salaryForm && <SalaryForm buttonName={modelDetails.buttonName} selectedObject={selectedObject} handleIsOpen={handleIsOpen} />}
            {salaryPaymentForm && <SalaryPaymentForm buttonName={modelDetails.buttonName} selectedObject={selectedObject} handleIsOpen={handleIsOpen} />}
            {bankAccountForm && <BankAccountForm buttonName={modelDetails.buttonName} selectedObject={selectedObject} handleIsOpen={handleIsOpen} />}
            {trainingBudgetForm && <TrainingBudgetForm buttonName={modelDetails.buttonName} selectedObject={selectedObject} handleIsOpen={handleIsOpen} />}
            {trainingRequestForm && <TrainingRequestForm buttonName={modelDetails.buttonName} selectedObject={selectedObject} handleIsOpen={handleIsOpen} />}
            {trainingBudgetRequestForm && <TrainingBudgetRequestForm buttonName={modelDetails.buttonName} selectedObject={selectedObject} handleIsOpen={handleIsOpen} />}
            {leaveApplicationForm && <LeaveApplicationForm buttonName={modelDetails.buttonName} selectedObject={selectedObject} handleIsOpen={handleIsOpen} />}
            {leaveBalanceForm && <LeaveBalanceForm buttonName={modelDetails.buttonName} selectedObject={selectedObject} handleIsOpen={handleIsOpen} />}
            {leaveTypeForm && <LeaveTypeForm buttonName={modelDetails.buttonName} selectedObject={selectedObject} handleIsOpen={handleIsOpen} />}
            {leaveStatusForm && <LeaveStatusUpdateForm buttonName={modelDetails.buttonName} selectedObject={selectedObject} handleIsOpen={handleIsOpen} />}
            {deleteForm && <DeleteForm objectName={modelDetails.objectName} handleIsOpen={handleIsOpen} objectId={modelDetails.objectId} onSuccess={onSuccess} />} 

        </div>
    </div>
</div> 
  )
}

export default Modal