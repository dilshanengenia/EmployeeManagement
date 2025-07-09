import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EducationalQualifications = () => {
  const [editMode, setEditMode] = useState(false);
  const [educationData, setEducationData] = useState([
    {
      degree: 'BSc Physics',
      university: 'University of XYZ',
      educationlevel: 'Bachelor',
      syear: '2018',
      cyear: '2022',
      edustatus: 'Completed',
    },
  ]);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleChange = (index, e) => {
    const newData = [...educationData];
    newData[index][e.target.name] = e.target.value;
    setEducationData(newData);
  };

  const handleSelectRow = (index) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter((i) => i !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };

  const addNewRow = () => {
    setEducationData([
      ...educationData,
      {
        degree: '',
        university: '',
        educationlevel: '',
        syear: '',
        cyear: '',
        edustatus: '',
      },
    ]);
  };

  const removeSelectedRows = () => {
    const newData = educationData.filter((_, index) => !selectedRows.includes(index));
    setEducationData(newData);
    setSelectedRows([]);
  };

  const toggleEdit = () => {
    if (editMode) {
      // Validate all rows before saving
      const isValid = educationData.every(
        (row) =>
          row.degree.trim() &&
          row.university.trim() &&
          row.educationlevel.trim() &&
          row.syear.trim() &&
          row.cyear.trim() &&
          row.edustatus.trim()
      );

      if (!isValid) {
        toast.error('Please fill in all fields before saving.', {
          position: 'top-right',
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      // Save logic here (e.g., API call or local update)
      console.log('Saved Educational Qualifications', educationData);
      toast.success('Educational Qualifications saved successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
    setEditMode(!editMode);
    setSelectedRows([]);
  };

  return (
    <>
      <div className="grid grid-cols-1">
        {/* Header and Action Buttons */}
        <div className="flex justify-between items-center border-b border-t border-gray-500 my-4 py-2 px-2">
          <p className="text-white text-lg font-semibold tracking-wide">
            --- Educational Qualifications ---
          </p>
          <div className="flex gap-2">
            <button
              onClick={toggleEdit}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
            >
              {editMode ? 'Save' : 'Edit'}
            </button>
            {editMode && (
              <>
                <button
                  onClick={addNewRow}
                  className="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                >
                  Add New
                </button>
                <button
                  onClick={removeSelectedRows}
                  disabled={selectedRows.length === 0}
                  className={`text-sm px-4 py-1 rounded ${
                    selectedRows.length === 0
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  Remove Selected
                </button>
              </>
            )}
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-7 gap-4 font-semibold text-gray-200 text-sm px-2 py-3 bg-gray-700 rounded-t-md">
          {editMode && <div>Select</div>}
          <div>Degree</div>
          <div>University</div>
          <div>Education Level</div>
          <div>Started Year</div>
          <div>Completed Year</div>
          <div>Status</div>
        </div>

        {/* Table Body */}
        {educationData.map((row, index) => (
          <div
            key={index}
            className="grid grid-cols-7 gap-4 px-2 py-4 border border-gray-600 rounded-md mb-2 items-center"
          >
            {editMode && (
              <div className="flex justify-center">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(index)}
                  onChange={() => handleSelectRow(index)}
                />
              </div>
            )}
            {editMode ? (
              <>
                <input
                  type="text"
                  name="degree"
                  value={row.degree}
                  onChange={(e) => handleChange(index, e)}
                  className="p-2 w-full border rounded-md dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
                />
                <input
                  type="text"
                  name="university"
                  value={row.university}
                  onChange={(e) => handleChange(index, e)}
                  className="p-2 w-full border rounded-md dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
                />
                <select
                  name="educationlevel"
                  value={row.educationlevel}
                  onChange={(e) => handleChange(index, e)}
                  className="w-full border rounded-md p-2 dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
                >
                  <option value="">-- Select --</option>
                  <option value="Bachelor">Bachelor</option>
                  <option value="Masters">Masters</option>
                  <option value="Doctorate">Doctorate</option>
                </select>
                <input
                  type="text"
                  name="syear"
                  value={row.syear}
                  onChange={(e) => handleChange(index, e)}
                  className="p-2 w-full border rounded-md dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
                />
                <input
                  type="text"
                  name="cyear"
                  value={row.cyear}
                  onChange={(e) => handleChange(index, e)}
                  className="p-2 w-full border rounded-md dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
                />
                <select
                  name="edustatus"
                  value={row.edustatus}
                  onChange={(e) => handleChange(index, e)}
                  className="w-full border rounded-md p-2 dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
                >
                  <option value="">-- Select --</option>
                  <option value="Reading">Reading</option>
                  <option value="Completed">Completed</option>
                </select>
              </>
            ) : (
              <>
                <div className="text-white col-span-1">{row.degree}</div>
                <div className="text-white col-span-1">{row.university}</div>
                <div className="text-white col-span-1">{row.educationlevel}</div>
                <div className="text-white col-span-1">{row.syear}</div>
                <div className="text-white col-span-1">{row.cyear}</div>
                <div className="text-white col-span-1">{row.edustatus}</div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Toast Container to render the toast notifications */}
      <ToastContainer />
    </>
  );
};

export default EducationalQualifications;
