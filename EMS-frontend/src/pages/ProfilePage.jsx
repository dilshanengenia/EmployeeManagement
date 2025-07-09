import React from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom';
import EducationalQualifications from '../components/EducationalQualifications ';
import PersonalInformation from '../components/PersonalInformation';
import OfficialInformation from '../components/OfficialInformation';
import ContactInformation from '../components/ContactInformation';

const ProfilePage = () => {

  const { sidebarToggle } = useOutletContext();
  const navigate = useNavigate();
  
  const coverimageurl = 'https://assets.datacom.com/is/image/datacom/AIAppModernisation_ArticleCoverImage_1920x600px_2x_V1?$article-cover-image$'
  
  const employee = {
    eid:'1',
    name:'EDCD Anuruddha',
    country:'Sri Lanka',
    empType:'Permanent',
    department:'Data Science',
    designation: 'Machine Learning Engineer',
    status: 'Active',
    image: 'https://ca.slack-edge.com/T0117DVURFS-U05KNLVPH6H-95b3c226bc8e-512'
  }

  const goBack = () => {
    navigate(-1)
  }

  return (
    <div className={`${sidebarToggle ? "ml-20": " ml-64 "} py-10 my-auto dark:bg-gray-900`}>
      <button type="button" onClick={goBack} className="m-2 text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"> &larr; Go Back</button>
      
      <div className="lg:w-[80%] md:w-[90%] w-[96%] mx-auto flex gap-4">
        <div className="lg:w-[88%] sm:w-[88%] w-full mx-auto shadow-2xl p-4 rounded-xl h-fit self-center dark:bg-gray-800/40">
          <div>
            <h1 className="lg:text-3xl md:text-2xl text-xl font-serif font-extrabold mb-2 dark:text-white">Profile</h1>
            <h2 className="text-grey text-sm mb-4 dark:text-gray-400">Create Profile</h2>

            <form>
              {/* Cover and Profile Images */}
              <div className="w-full rounded-sm bg-cover bg-center bg-no-repeat items-center" style={{ backgroundImage: `url(${coverimageurl})`}}>
                <div className="mx-auto flex justify-center w-[141px] h-[141px] bg-blue-300/20 rounded-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${employee.image})` }}>
                  <div className="bg-white/90 rounded-full w-6 h-6 text-center ml-28 mt-4">
                    <input type="file" name="profile" id="upload_profile" hidden required />
                    <label htmlFor="upload_profile">
                      <svg data-slot="icon" className="w-6 h-5 text-blue-700" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"></path>
                      </svg>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end">
                  <input type="file" name="profile" id="upload_cover" hidden required />
                  <div className="bg-white flex items-center gap-1 rounded-tl-md px-2 text-center font-semibold">
                    <label htmlFor="upload_cover" className="inline-flex items-center gap-1 cursor-pointer">
                      Cover
                      <svg data-slot="icon" className="w-6 h-5 text-blue-700" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"></path>
                      </svg>
                    </label>
                  </div>
                </div>
             </div>

                <PersonalInformation />
                <OfficialInformation />
                <EducationalQualifications />
                <ContactInformation />

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
