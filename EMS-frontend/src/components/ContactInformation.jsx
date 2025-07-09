import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactInformation = () => {
  const [editMode, setEditMode] = useState(false);

  const [emails, setEmails] = useState([
    { email: 'user@example.com', type: 'Official' },
  ]);
  const [phones, setPhones] = useState([
    { phone: '+91-9876543210', type: 'Personal' },
  ]);

  const [selectedEmailRows, setSelectedEmailRows] = useState([]);
  const [selectedPhoneRows, setSelectedPhoneRows] = useState([]);

  const handleEmailChange = (index, e) => {
    const newEmails = [...emails];
    newEmails[index][e.target.name] = e.target.value;
    setEmails(newEmails);
  };

  const handlePhoneChange = (index, e) => {
    const newPhones = [...phones];
    newPhones[index][e.target.name] = e.target.value;
    setPhones(newPhones);
  };

  const handleSelectEmailRow = (index) => {
    setSelectedEmailRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSelectPhoneRow = (index) => {
    setSelectedPhoneRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const addEmailRow = () => {
    setEmails([...emails, { email: '', type: '' }]);
  };

  const addPhoneRow = () => {
    setPhones([...phones, { phone: '', type: '' }]);
  };

  const removeSelectedEmails = () => {
    setEmails(emails.filter((_, i) => !selectedEmailRows.includes(i)));
    setSelectedEmailRows([]);
  };

  const removeSelectedPhones = () => {
    setPhones(phones.filter((_, i) => !selectedPhoneRows.includes(i)));
    setSelectedPhoneRows([]);
  };

  const toggleEdit = () => {
    if (editMode) {
      const emailValid = emails.every((e) => e.email.trim() && e.type);
      const phoneValid = phones.every((p) => p.phone.trim() && p.type);

      if (!emailValid || !phoneValid) {
        toast.error('Please fill in all contact fields before saving.', {
          position: 'top-right',
          autoClose: 3000,
        });
        return;
      }

      console.log('Saved Contact Information', { emails, phones });
      toast.success('Contact Information saved successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    }

    setEditMode(!editMode);
    setSelectedEmailRows([]);
    setSelectedPhoneRows([]);
  };

  return (
    <div className="grid grid-cols-1">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-t border-gray-500 my-4 py-2 px-2">
        <p className="text-white text-lg font-semibold tracking-wide">
          --- Contact Information ---
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
                onClick={addEmailRow}
                className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
              >
                Add Email
              </button>
              <button
                onClick={removeSelectedEmails}
                disabled={selectedEmailRows.length === 0}
                className={`text-sm px-3 py-1 rounded ${
                  selectedEmailRows.length === 0
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                Remove Email
              </button>
              <button
                onClick={addPhoneRow}
                className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
              >
                Add Phone
              </button>
              <button
                onClick={removeSelectedPhones}
                disabled={selectedPhoneRows.length === 0}
                className={`text-sm px-3 py-1 rounded ${
                  selectedPhoneRows.length === 0
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                Remove Phone
              </button>
            </>
          )}
        </div>
      </div>

      {/* Side-by-Side Emails and Phones */}
      <div className="flex flex-col md:flex-row gap-6 mt-4">
        {/* Emails Section */}
        <div className="w-full md:w-1/2">
          <p className="text-white font-medium px-2">Emails</p>
          <div
            className={`grid ${
              editMode ? 'grid-cols-[3fr_1fr_1fr]' : 'grid-cols-[4fr_1fr]'
            } gap-4 font-semibold text-gray-200 text-sm px-2 py-3 bg-gray-700 rounded-t-md`}
          >
            {editMode && <div>Select</div>}
            <div>Email</div>
            <div>Type</div>
          </div>
          {emails.map((row, index) => (
            <div
              key={index}
              className={`grid ${
                editMode ? 'grid-cols-[3fr_1fr_1fr]' : 'grid-cols-[4fr_1fr]'
              } gap-4 px-2 py-3 border border-gray-600 rounded-md mb-2 items-center`}
            >
              {editMode && (
                <div className="flex justify-center">
                  <input
                    type="checkbox"
                    checked={selectedEmailRows.includes(index)}
                    onChange={() => handleSelectEmailRow(index)}
                  />
                </div>
              )}
              {editMode ? (
                <>
                  <input
                    type="email"
                    name="email"
                    value={row.email}
                    onChange={(e) => handleEmailChange(index, e)}
                    className="p-2 w-full border rounded-md dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
                  />
                  <select
                    name="type"
                    value={row.type}
                    onChange={(e) => handleEmailChange(index, e)}
                    className="w-full p-2 border rounded-md dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
                  >
                    <option value="">-- Select --</option>
                    <option value="Official">Official</option>
                    <option value="Personal">Personal</option>
                  </select>
                </>
              ) : (
                <>
                  <div className="text-white">{row.email}</div>
                  <div className="text-white">{row.type}</div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Phones Section */}
        <div className="w-full md:w-1/2">
          <p className="text-white font-medium px-2">Phone Numbers</p>
          <div
            className={`grid ${
              editMode ? 'grid-cols-[3fr_1fr_1fr]' : 'grid-cols-[4fr_1fr]'
            } gap-4 font-semibold text-gray-200 text-sm px-2 py-3 bg-gray-700 rounded-t-md`}
          >
            {editMode && <div>Select</div>}
            <div>Phone</div>
            <div>Type</div>
          </div>
          {phones.map((row, index) => (
            <div
              key={index}
              className={`grid ${
                editMode ? 'grid-cols-[3fr_1fr_1fr]' : 'grid-cols-[4fr_1fr]'
              } gap-4 px-2 py-3 border border-gray-600 rounded-md mb-2 items-center`}
            >
              {editMode && (
                <div className="flex justify-center">
                  <input
                    type="checkbox"
                    checked={selectedPhoneRows.includes(index)}
                    onChange={() => handleSelectPhoneRow(index)}
                  />
                </div>
              )}
              {editMode ? (
                <>
                  <input
                    type="text"
                    name="phone"
                    value={row.phone}
                    onChange={(e) => handlePhoneChange(index, e)}
                    className="p-2 w-full border rounded-md dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
                  />
                  <select
                    name="type"
                    value={row.type}
                    onChange={(e) => handlePhoneChange(index, e)}
                    className="w-full p-2 border rounded-md dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
                  >
                    <option value="">-- Select --</option>
                    <option value="Official">Official</option>
                    <option value="Personal">Personal</option>
                  </select>
                </>
              ) : (
                <>
                  <div className="text-white">{row.phone}</div>
                  <div className="text-white">{row.type}</div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Toasts */}
      <ToastContainer />
    </div>
  );
};

export default ContactInformation;
