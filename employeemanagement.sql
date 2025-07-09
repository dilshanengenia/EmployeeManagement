-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 09, 2025 at 08:46 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `employeemanagement`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`username`, `password`) VALUES
('ADMIN', '123456');

-- --------------------------------------------------------

--
-- Table structure for table `authtoken_token`
--

CREATE TABLE `authtoken_token` (
  `key` varchar(40) NOT NULL,
  `created` datetime(6) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_group`
--

CREATE TABLE `auth_group` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_group_permissions`
--

CREATE TABLE `auth_group_permissions` (
  `id` bigint(20) NOT NULL,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_permission`
--

CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `auth_permission`
--

INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES
(1, 'Can add log entry', 1, 'add_logentry'),
(2, 'Can change log entry', 1, 'change_logentry'),
(3, 'Can delete log entry', 1, 'delete_logentry'),
(4, 'Can view log entry', 1, 'view_logentry'),
(5, 'Can add permission', 2, 'add_permission'),
(6, 'Can change permission', 2, 'change_permission'),
(7, 'Can delete permission', 2, 'delete_permission'),
(8, 'Can view permission', 2, 'view_permission'),
(9, 'Can add group', 3, 'add_group'),
(10, 'Can change group', 3, 'change_group'),
(11, 'Can delete group', 3, 'delete_group'),
(12, 'Can view group', 3, 'view_group'),
(13, 'Can add user', 4, 'add_user'),
(14, 'Can change user', 4, 'change_user'),
(15, 'Can delete user', 4, 'delete_user'),
(16, 'Can view user', 4, 'view_user'),
(17, 'Can add content type', 5, 'add_contenttype'),
(18, 'Can change content type', 5, 'change_contenttype'),
(19, 'Can delete content type', 5, 'delete_contenttype'),
(20, 'Can view content type', 5, 'view_contenttype'),
(21, 'Can add session', 6, 'add_session'),
(22, 'Can change session', 6, 'change_session'),
(23, 'Can delete session', 6, 'delete_session'),
(24, 'Can view session', 6, 'view_session'),
(25, 'Can add departments', 7, 'add_departments'),
(26, 'Can change departments', 7, 'change_departments'),
(27, 'Can delete departments', 7, 'delete_departments'),
(28, 'Can view departments', 7, 'view_departments'),
(29, 'Can add Token', 8, 'add_token'),
(30, 'Can change Token', 8, 'change_token'),
(31, 'Can delete Token', 8, 'delete_token'),
(32, 'Can view Token', 8, 'view_token'),
(33, 'Can add Token', 9, 'add_tokenproxy'),
(34, 'Can change Token', 9, 'change_tokenproxy'),
(35, 'Can delete Token', 9, 'delete_tokenproxy'),
(36, 'Can view Token', 9, 'view_tokenproxy'),
(37, 'Can add blacklisted token', 10, 'add_blacklistedtoken'),
(38, 'Can change blacklisted token', 10, 'change_blacklistedtoken'),
(39, 'Can delete blacklisted token', 10, 'delete_blacklistedtoken'),
(40, 'Can view blacklisted token', 10, 'view_blacklistedtoken'),
(41, 'Can add outstanding token', 11, 'add_outstandingtoken'),
(42, 'Can change outstanding token', 11, 'change_outstandingtoken'),
(43, 'Can delete outstanding token', 11, 'delete_outstandingtoken'),
(44, 'Can view outstanding token', 11, 'view_outstandingtoken'),
(45, 'Can add departments', 12, 'add_departments'),
(46, 'Can change departments', 12, 'change_departments'),
(47, 'Can delete departments', 12, 'delete_departments'),
(48, 'Can view departments', 12, 'view_departments'),
(49, 'Can add employee education', 13, 'add_employeeeducation'),
(50, 'Can change employee education', 13, 'change_employeeeducation'),
(51, 'Can delete employee education', 13, 'delete_employeeeducation'),
(52, 'Can view employee education', 13, 'view_employeeeducation'),
(53, 'Can add employee emails', 14, 'add_employeeemails'),
(54, 'Can change employee emails', 14, 'change_employeeemails'),
(55, 'Can delete employee emails', 14, 'delete_employeeemails'),
(56, 'Can view employee emails', 14, 'view_employeeemails'),
(57, 'Can add employee phones', 15, 'add_employeephones'),
(58, 'Can change employee phones', 15, 'change_employeephones'),
(59, 'Can delete employee phones', 15, 'delete_employeephones'),
(60, 'Can view employee phones', 15, 'view_employeephones'),
(61, 'Can add employees', 16, 'add_employees'),
(62, 'Can change employees', 16, 'change_employees'),
(63, 'Can delete employees', 16, 'delete_employees'),
(64, 'Can view employees', 16, 'view_employees'),
(65, 'Can add employee types', 17, 'add_employeetypes'),
(66, 'Can change employee types', 17, 'change_employeetypes'),
(67, 'Can delete employee types', 17, 'delete_employeetypes'),
(68, 'Can view employee types', 17, 'view_employeetypes'),
(69, 'Can add users', 18, 'add_users'),
(70, 'Can change users', 18, 'change_users'),
(71, 'Can delete users', 18, 'delete_users'),
(72, 'Can view users', 18, 'view_users'),
(73, 'Can add user types', 19, 'add_usertypes'),
(74, 'Can change user types', 19, 'change_usertypes'),
(75, 'Can delete user types', 19, 'delete_usertypes'),
(76, 'Can view user types', 19, 'view_usertypes'),
(77, 'Can add salary', 20, 'add_salary'),
(78, 'Can change salary', 20, 'change_salary'),
(79, 'Can delete salary', 20, 'delete_salary'),
(80, 'Can view salary', 20, 'view_salary'),
(81, 'Can add salary payments', 21, 'add_salarypayments'),
(82, 'Can change salary payments', 21, 'change_salarypayments'),
(83, 'Can delete salary payments', 21, 'delete_salarypayments'),
(84, 'Can view salary payments', 21, 'view_salarypayments'),
(85, 'Can add bank account details', 22, 'add_bankaccountdetails'),
(86, 'Can change bank account details', 22, 'change_bankaccountdetails'),
(87, 'Can delete bank account details', 22, 'delete_bankaccountdetails'),
(88, 'Can view bank account details', 22, 'view_bankaccountdetails'),
(89, 'Can add training budget', 23, 'add_trainingbudget'),
(90, 'Can change training budget', 23, 'change_trainingbudget'),
(91, 'Can delete training budget', 23, 'delete_trainingbudget'),
(92, 'Can view training budget', 23, 'view_trainingbudget'),
(93, 'Can add training request', 24, 'add_trainingrequest'),
(94, 'Can change training request', 24, 'change_trainingrequest'),
(95, 'Can delete training request', 24, 'delete_trainingrequest'),
(96, 'Can view training request', 24, 'view_trainingrequest'),
(97, 'Can add employee leave balance', 25, 'add_employeeleavebalance'),
(98, 'Can change employee leave balance', 25, 'change_employeeleavebalance'),
(99, 'Can delete employee leave balance', 25, 'delete_employeeleavebalance'),
(100, 'Can view employee leave balance', 25, 'view_employeeleavebalance'),
(101, 'Can add leave applications', 26, 'add_leaveapplications'),
(102, 'Can change leave applications', 26, 'change_leaveapplications'),
(103, 'Can delete leave applications', 26, 'delete_leaveapplications'),
(104, 'Can view leave applications', 26, 'view_leaveapplications'),
(105, 'Can add leave type', 27, 'add_leavetype'),
(106, 'Can change leave type', 27, 'change_leavetype'),
(107, 'Can delete leave type', 27, 'delete_leavetype'),
(108, 'Can view leave type', 27, 'view_leavetype');

-- --------------------------------------------------------

--
-- Table structure for table `auth_user`
--

CREATE TABLE `auth_user` (
  `id` int(11) NOT NULL,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_user_groups`
--

CREATE TABLE `auth_user_groups` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_user_user_permissions`
--

CREATE TABLE `auth_user_user_permissions` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bankaccountdetails`
--

CREATE TABLE `bankaccountdetails` (
  `Eid` int(11) NOT NULL,
  `BankAccountHolderName` varchar(100) DEFAULT NULL,
  `BankAccNo` varchar(30) DEFAULT NULL,
  `BankName` varchar(100) DEFAULT NULL,
  `BankBranchName` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bankaccountdetails`
--

INSERT INTO `bankaccountdetails` (`Eid`, `BankAccountHolderName`, `BankAccNo`, `BankName`, `BankBranchName`) VALUES
(1, 'Chamika Anurudda', '789', 'Commercial Bank', 'Piliyandala'),
(2, 'Dilshan Abeykoon', '123', 'Bank of Ceylon', 'Peradeniya');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `department_number` varchar(3) NOT NULL,
  `department_name` varchar(100) NOT NULL,
  `number_of_employees` int(11) NOT NULL,
  `department_location` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`department_number`, `department_name`, `number_of_employees`, `department_location`) VALUES
('001', 'Human Resources', 12, 'Australia'),
('002', 'Information Technology', 25, 'Sri Lanka'),
('003', 'Finance', 10, 'Australia'),
('004', 'Data Science', 18, 'Sri Lanka');

-- --------------------------------------------------------

--
-- Table structure for table `django_admin_log`
--

CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext DEFAULT NULL,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) UNSIGNED NOT NULL CHECK (`action_flag` >= 0),
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `django_content_type`
--

CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `django_content_type`
--

INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES
(1, 'admin', 'logentry'),
(3, 'auth', 'group'),
(2, 'auth', 'permission'),
(4, 'auth', 'user'),
(8, 'authtoken', 'token'),
(9, 'authtoken', 'tokenproxy'),
(5, 'contenttypes', 'contenttype'),
(7, 'emsroot', 'departments'),
(22, 'root', 'bankaccountdetails'),
(12, 'root', 'departments'),
(13, 'root', 'employeeeducation'),
(14, 'root', 'employeeemails'),
(25, 'root', 'employeeleavebalance'),
(15, 'root', 'employeephones'),
(16, 'root', 'employees'),
(17, 'root', 'employeetypes'),
(26, 'root', 'leaveapplications'),
(27, 'root', 'leavetype'),
(20, 'root', 'salary'),
(21, 'root', 'salarypayments'),
(23, 'root', 'trainingbudget'),
(24, 'root', 'trainingrequest'),
(18, 'root', 'users'),
(19, 'root', 'usertypes'),
(6, 'sessions', 'session'),
(10, 'token_blacklist', 'blacklistedtoken'),
(11, 'token_blacklist', 'outstandingtoken');

-- --------------------------------------------------------

--
-- Table structure for table `django_migrations`
--

CREATE TABLE `django_migrations` (
  `id` bigint(20) NOT NULL,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `django_migrations`
--

INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES
(1, 'contenttypes', '0001_initial', '2025-04-17 04:38:26.186067'),
(2, 'auth', '0001_initial', '2025-04-17 04:38:26.310460'),
(3, 'admin', '0001_initial', '2025-04-17 04:38:26.344775'),
(4, 'admin', '0002_logentry_remove_auto_add', '2025-04-17 04:38:26.351355'),
(5, 'admin', '0003_logentry_add_action_flag_choices', '2025-04-17 04:38:26.354799'),
(6, 'contenttypes', '0002_remove_content_type_name', '2025-04-17 04:38:26.378777'),
(7, 'auth', '0002_alter_permission_name_max_length', '2025-04-17 04:38:26.399059'),
(8, 'auth', '0003_alter_user_email_max_length', '2025-04-17 04:38:26.415272'),
(9, 'auth', '0004_alter_user_username_opts', '2025-04-17 04:38:26.421315'),
(10, 'auth', '0005_alter_user_last_login_null', '2025-04-17 04:38:26.434843'),
(11, 'auth', '0006_require_contenttypes_0002', '2025-04-17 04:38:26.436572'),
(12, 'auth', '0007_alter_validators_add_error_messages', '2025-04-17 04:38:26.440629'),
(13, 'auth', '0008_alter_user_username_max_length', '2025-04-17 04:38:26.446327'),
(14, 'auth', '0009_alter_user_last_name_max_length', '2025-04-17 04:38:26.452572'),
(15, 'auth', '0010_alter_group_name_max_length', '2025-04-17 04:38:26.452572'),
(16, 'auth', '0011_update_proxy_permissions', '2025-04-17 04:38:26.452572'),
(17, 'auth', '0012_alter_user_first_name_max_length', '2025-04-17 04:38:26.471216'),
(18, 'emsroot', '0001_initial', '2025-04-17 04:38:26.472635'),
(19, 'sessions', '0001_initial', '2025-04-17 04:38:26.480537'),
(20, 'authtoken', '0001_initial', '2025-04-30 08:47:43.428778'),
(21, 'authtoken', '0002_auto_20160226_1747', '2025-04-30 08:47:43.445902'),
(22, 'authtoken', '0003_tokenproxy', '2025-04-30 08:47:43.445902'),
(23, 'authtoken', '0004_alter_tokenproxy_options', '2025-04-30 08:47:43.452589'),
(24, 'token_blacklist', '0001_initial', '2025-05-08 04:54:36.422835'),
(25, 'token_blacklist', '0002_outstandingtoken_jti_hex', '2025-05-08 04:54:36.457063'),
(26, 'token_blacklist', '0003_auto_20171017_2007', '2025-05-08 04:54:36.476176'),
(27, 'token_blacklist', '0004_auto_20171017_2013', '2025-05-08 04:54:36.525420'),
(28, 'token_blacklist', '0005_remove_outstandingtoken_jti', '2025-05-08 04:54:36.544771'),
(29, 'token_blacklist', '0006_auto_20171017_2113', '2025-05-08 04:54:36.566910'),
(30, 'token_blacklist', '0007_auto_20171017_2214', '2025-05-08 04:54:36.827991'),
(31, 'token_blacklist', '0008_migrate_to_bigautofield', '2025-05-08 04:54:37.042244'),
(32, 'token_blacklist', '0010_fix_migrate_to_bigautofield', '2025-05-08 04:54:37.063851'),
(33, 'token_blacklist', '0011_linearizes_history', '2025-05-08 04:54:37.068120'),
(34, 'token_blacklist', '0012_alter_outstandingtoken_user', '2025-05-08 04:54:37.083213'),
(35, 'root', '0001_initial', '2025-05-17 10:48:28.151993'),
(36, 'root', '0002_employeeeducation_employeeemails_employeephones_and_more', '2025-05-17 10:48:28.154898'),
(37, 'root', '0003_salary_salarypayments', '2025-05-17 10:59:18.104457'),
(38, 'root', '0004_bankaccountdetails', '2025-05-17 13:53:27.363640'),
(39, 'root', '0005_trainingbudget_trainingrequest', '2025-05-18 12:02:49.275877'),
(40, 'root', '0006_alter_trainingbudget_table_and_more', '2025-06-05 03:25:37.545864'),
(41, 'root', '0007_employeeleavebalance_leaveapplications_leavetype', '2025-06-11 05:28:18.740791');

-- --------------------------------------------------------

--
-- Table structure for table `django_session`
--

CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `django_session`
--

INSERT INTO `django_session` (`session_key`, `session_data`, `expire_date`) VALUES
('4qu9qvpkmoz6w93gl8609sjgs9ly6b2r', '.eJyrVsosjk9Myc3Mi08sLclIzSvJTE4sSU1RsiopKk3VUSotTi2KL8rPSVWyUgIrU4KI5SXmgoQcXXw9_YBCIEOwaU_NBDKVDKCaYGY4pOalp-ZlJhbn55SWZObnFesl5-fqJZYClaFYVQsAWi026g:1u9NJr:0bz5FsRYOcZLcmAXog0XwYN0-syCa_CF7XCh2zGkE-k', '2025-05-12 12:10:43.123583'),
('f9mswoh4yyg6ktog76u3fmru4m0uwvck', 'eyJ1c2VyIjoiQURNSU4iLCJyb2xlIjoiYWRtaW4iLCJpc19hdXRoZW50aWNhdGVkIjp0cnVlfQ:1u7pxL:CNV52_Ee6QObfdFMHETKGJIp8D0SFJqbCjvScjZO0jA', '2025-05-08 06:21:07.765075'),
('l7xqdjc1mob1ff52zqollepwivxmtfq0', '.eJw1yzEKgDAMRuG7ZC7F2cmbSGh_NNAm0CaTeHe7uD6-9xCk0k4bJZJ5cvgNdSnsWNlHIFFMjEW4dtEDekGFp7VwMZ25WM8cax_W8DN6P16THvw:1uCAYz:T02hsr8huU00DmjU9uJWmPLq2WgGyXZrD80eRaUmut0', '2025-05-20 05:09:53.868938'),
('prps5l8ho92muz58w7rrep1gyk0ujogm', 'eyJpc19hdXRoZW50aWNhdGVkIjp0cnVlLCJlaWQiOiIzIiwidXNlciI6IkFETUlOIiwicm9sZSI6ImFkbWluIn0:1u9JMz:yNIsji2AQDChj5YEDPRKVk9yk8jCrZZ6bFLzxn3-vBA', '2025-05-12 07:57:41.165044');

-- --------------------------------------------------------

--
-- Table structure for table `employeedetails`
--

CREATE TABLE `employeedetails` (
  `Eid` int(11) NOT NULL,
  `FullName` varchar(100) DEFAULT NULL,
  `InitName` varchar(50) DEFAULT NULL,
  `Gender` enum('Male','Female','Other') DEFAULT NULL,
  `DOB` date DEFAULT NULL,
  `MaritialStatus` varchar(20) DEFAULT NULL,
  `Address` text DEFAULT NULL,
  `Country` varchar(50) DEFAULT NULL,
  `Designation` varchar(100) DEFAULT NULL,
  `EmployeeType` varchar(50) DEFAULT NULL,
  `Department` varchar(100) DEFAULT NULL,
  `Status` enum('Active','Inactive') DEFAULT NULL,
  `UserType` varchar(50) DEFAULT NULL,
  `Degree` varchar(100) DEFAULT NULL,
  `University` varchar(100) DEFAULT NULL,
  `EducationLevel` varchar(50) DEFAULT NULL,
  `StartedYear` year(4) DEFAULT NULL,
  `CompletedYear` year(4) DEFAULT NULL,
  `EducationStatus` varchar(50) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `EmailType` enum('Personal','Official') DEFAULT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  `PhoneType` enum('Personal','Official') DEFAULT NULL,
  `Image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employeedetails`
--

INSERT INTO `employeedetails` (`Eid`, `FullName`, `InitName`, `Gender`, `DOB`, `MaritialStatus`, `Address`, `Country`, `Designation`, `EmployeeType`, `Department`, `Status`, `UserType`, `Degree`, `University`, `EducationLevel`, `StartedYear`, `CompletedYear`, `EducationStatus`, `Email`, `EmailType`, `Phone`, `PhoneType`, `Image`) VALUES
(1, 'Ehelapage Don Chamika Dilshan Anuruddha', 'EDCD Anuruddha', 'Male', '1998-09-13', 'Married', '70/3/C Samagi Mawahta, Makuluduwa, Piliyandala', 'Sri Lanka', 'Senior Machine Learning Engineer', 'Permanent', 'Data Science', 'Active', 'Employee', 'BSc Physics', 'University of Colombo', 'Bachelor', '2018', '2022', 'Completed', 'chamika@gmail.com', 'Official', '+91-9876543210', 'Personal', ''),
(2, 'Abeykoon Mudiyanselage Dilshan Yasantha Bandara Abeykoon', 'AMDYB Abeykoon', 'Male', '1999-04-07', 'Single', '12/136, Udaperadeniya,Peradeniya, Kandy', 'Sri Lanka', 'Junior Machine Learning Engineer', 'Permanent', 'Data Science', 'Active', 'Employee', 'Computer Science with Artificial Intelligence', 'Coventry University', 'Bachelor', '2022', '2025', 'Completed', 'dilshan@engeniasolutions.com.au', 'Official', '+94718542662', 'Personal', '');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `Eid` varchar(100) NOT NULL,
  `FullName` varchar(255) DEFAULT NULL,
  `InitName` varchar(255) DEFAULT NULL,
  `DOB` date DEFAULT NULL,
  `Gender` varchar(10) DEFAULT NULL,
  `Country` varchar(50) DEFAULT NULL,
  `Address` longtext DEFAULT NULL,
  `MaritialStatus` varchar(10) DEFAULT NULL,
  `Image` longtext DEFAULT NULL,
  `Etid` varchar(100) DEFAULT NULL,
  `Dno` int(11) DEFAULT NULL,
  `Designation` varchar(255) DEFAULT NULL,
  `Urid` varchar(100) DEFAULT NULL,
  `Status` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `expectedtrainingbudgets`
--

CREATE TABLE `expectedtrainingbudgets` (
  `Eid` varchar(10) NOT NULL,
  `ExpectedBudget` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expectedtrainingbudgets`
--

INSERT INTO `expectedtrainingbudgets` (`Eid`, `ExpectedBudget`) VALUES
('E001', 16000.00),
('E002', 20000.00),
('E003', 25000.00);

-- --------------------------------------------------------

--
-- Table structure for table `leaveapply`
--

CREATE TABLE `leaveapply` (
  `Eid` varchar(10) NOT NULL,
  `Lid` varchar(10) NOT NULL,
  `FromDate` date NOT NULL,
  `ToDate` date NOT NULL,
  `NoOfDays` int(11) NOT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `Status` enum('Approved','Pending','Rejected') DEFAULT 'Pending',
  `Priority` enum('Low','Medium','High') DEFAULT 'Medium'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `leaveapply`
--

INSERT INTO `leaveapply` (`Eid`, `Lid`, `FromDate`, `ToDate`, `NoOfDays`, `Description`, `Status`, `Priority`) VALUES
('3', 'L001', '2025-06-17', '2025-06-17', 1, 'Sick', 'Approved', 'High'),
('3', 'L002', '2025-06-24', '2025-06-25', 2, 'ggg', 'Rejected', 'Medium'),
('2', 'L003', '2025-06-29', '2025-06-30', 2, 'Have to attend the graduation', 'Approved', 'High');

-- --------------------------------------------------------

--
-- Table structure for table `leavebalance`
--

CREATE TABLE `leavebalance` (
  `Eid` varchar(10) NOT NULL,
  `TotalAnnualLeaves` int(11) NOT NULL,
  `TotalCasualLeaves` int(11) NOT NULL,
  `AnnualLeaveBalance` int(11) NOT NULL,
  `CasualLeaveBalance` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `leavebalance`
--

INSERT INTO `leavebalance` (`Eid`, `TotalAnnualLeaves`, `TotalCasualLeaves`, `AnnualLeaveBalance`, `CasualLeaveBalance`) VALUES
('1', 14, 7, 9, 5),
('2', 14, 7, 12, 6),
('3', 14, 7, 10, 4);

-- --------------------------------------------------------

--
-- Table structure for table `leaves`
--

CREATE TABLE `leaves` (
  `Lid` varchar(10) NOT NULL,
  `LeaveType` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `leaves`
--

INSERT INTO `leaves` (`Lid`, `LeaveType`) VALUES
('L001', 'Annual'),
('L002', 'Casual'),
('L003', 'Casual'),
('L004', 'Annual'),
('L005', 'Casual');

-- --------------------------------------------------------

--
-- Table structure for table `resourceallocation`
--

CREATE TABLE `resourceallocation` (
  `AllocationID` int(11) NOT NULL,
  `Eid` varchar(10) NOT NULL,
  `Rid` varchar(10) DEFAULT NULL,
  `AllocatedDate` date NOT NULL,
  `CollectedDate` date DEFAULT NULL,
  `UsedDays` int(11) GENERATED ALWAYS AS (to_days(`CollectedDate`) - to_days(`AllocatedDate`)) STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `resourceallocation`
--

INSERT INTO `resourceallocation` (`AllocationID`, `Eid`, `Rid`, `AllocatedDate`, `CollectedDate`) VALUES
(1, '1', 'R002', '2025-04-01', '2025-04-10'),
(2, '2', 'R004', '2025-04-05', '2025-04-12');

-- --------------------------------------------------------

--
-- Table structure for table `salary`
--

CREATE TABLE `salary` (
  `Eid` int(11) NOT NULL,
  `BasicSalary` decimal(10,2) DEFAULT NULL,
  `InterNetCharges` decimal(10,2) DEFAULT NULL,
  `Allowances` decimal(10,2) DEFAULT NULL,
  `Deductions` decimal(10,2) DEFAULT NULL,
  `NetSalary` decimal(10,2) DEFAULT NULL,
  `EPF_Employee` decimal(10,2) DEFAULT NULL,
  `EPF_Employer` decimal(10,2) DEFAULT NULL,
  `ETF_Employer` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `salary`
--

INSERT INTO `salary` (`Eid`, `BasicSalary`, `InterNetCharges`, `Allowances`, `Deductions`, `NetSalary`, `EPF_Employee`, `EPF_Employer`, `ETF_Employer`) VALUES
(1, 80000.00, 1500.00, 5500.00, 3000.00, 84000.00, 6400.00, 9600.00, 2400.00),
(2, 75000.00, 1500.00, 4000.00, 2000.00, 78500.00, 6000.00, 9000.00, 2250.00),
(3, 70000.00, 2500.00, 3500.00, 1500.00, 74500.00, 5600.00, 8400.00, 2100.00);

-- --------------------------------------------------------

--
-- Table structure for table `salarypayments`
--

CREATE TABLE `salarypayments` (
  `Eid` int(11) DEFAULT NULL,
  `Salary` decimal(10,2) DEFAULT NULL,
  `PaidDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `salarypayments`
--

INSERT INTO `salarypayments` (`Eid`, `Salary`, `PaidDate`) VALUES
(2, 78500.00, '2025-04-01'),
(3, 74500.00, '2025-04-16'),
(1, 83500.00, '2025-05-08');

-- --------------------------------------------------------

--
-- Table structure for table `token_blacklist_blacklistedtoken`
--

CREATE TABLE `token_blacklist_blacklistedtoken` (
  `id` bigint(20) NOT NULL,
  `blacklisted_at` datetime(6) NOT NULL,
  `token_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `token_blacklist_outstandingtoken`
--

CREATE TABLE `token_blacklist_outstandingtoken` (
  `id` bigint(20) NOT NULL,
  `token` longtext NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `expires_at` datetime(6) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `jti` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `training`
--

CREATE TABLE `training` (
  `Eid` int(11) NOT NULL,
  `TrainingBudgetRate` decimal(5,2) DEFAULT NULL,
  `TrainingBudgetAmount` decimal(10,2) DEFAULT NULL,
  `RemainingAmount` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `training`
--

INSERT INTO `training` (`Eid`, `TrainingBudgetRate`, `TrainingBudgetAmount`, `RemainingAmount`) VALUES
(1, 10.00, 10000.00, 10000.00),
(2, 8.52, 8500.00, 6000.00),
(3, 12.00, 12000.00, 4000.00);

-- --------------------------------------------------------

--
-- Table structure for table `trainingapprovals`
--

CREATE TABLE `trainingapprovals` (
  `Eid` varchar(10) NOT NULL,
  `Level1Status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `Level1Date` datetime DEFAULT NULL,
  `Level1By` varchar(10) DEFAULT NULL,
  `Level2Status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `Level2Date` datetime DEFAULT NULL,
  `Level2By` varchar(10) DEFAULT NULL,
  `Level3Status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `Level3Date` datetime DEFAULT NULL,
  `Level3By` varchar(10) DEFAULT NULL,
  `FinalStatus` varchar(10) GENERATED ALWAYS AS (case when `Level1Status` = 'Approved' and `Level2Status` = 'Approved' and `Level3Status` = 'Approved' then 'Approved' when `Level1Status` = 'Rejected' or `Level2Status` = 'Rejected' or `Level3Status` = 'Rejected' then 'Rejected' else 'Pending' end) STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `trainingbudgetallocation`
--

CREATE TABLE `trainingbudgetallocation` (
  `Eid` int(11) DEFAULT NULL,
  `RequestedAmount` decimal(10,2) DEFAULT NULL,
  `Reason` varchar(255) DEFAULT NULL,
  `AppliedDate` date DEFAULT NULL,
  `Status` enum('Approved','Pending','Rejected') DEFAULT NULL,
  `GrantedDate` date DEFAULT NULL,
  `ProofDocumentUrl` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trainingbudgetallocation`
--

INSERT INTO `trainingbudgetallocation` (`Eid`, `RequestedAmount`, `Reason`, `AppliedDate`, `Status`, `GrantedDate`, `ProofDocumentUrl`) VALUES
(1, 4500.00, 'Python Certification Course', '2025-03-01', 'Rejected', '2025-05-18', 'http://example.com/docs/1.pdf'),
(2, 2500.00, 'AWS Training', '2025-04-10', 'Rejected', '2025-05-08', NULL),
(3, 500.00, 'Cubernets', '2025-06-16', 'Approved', '2025-06-16', NULL),
(3, 500.00, 'Cubernets', '2025-06-16', 'Approved', '2025-06-16', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `trainingobjectives`
--

CREATE TABLE `trainingobjectives` (
  `ObjectiveID` varchar(10) NOT NULL,
  `Eid` varchar(10) NOT NULL,
  `ObjectiveText` text NOT NULL,
  `Status` enum('Completed','Not Completed') DEFAULT 'Not Completed'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trainingobjectives`
--

INSERT INTO `trainingobjectives` (`ObjectiveID`, `Eid`, `ObjectiveText`, `Status`) VALUES
('OB001', 'E001', 'Enhance Python programming skills', 'Completed'),
('OB002', 'E001', 'Master Java Skills', 'Not Completed'),
('OB003', 'E002', 'Gain certification in AWS cloud fundamentals', 'Not Completed'),
('OB004', 'E002', 'Improve project management techniques', 'Not Completed'),
('OB005', 'E003', 'Master data visualization using Power BI', 'Not Completed'),
('OB006', 'E001', 'Develop Azure cloud skills', 'Not Completed'),
('OB007', 'E001', 'Learn CI/CD', 'Not Completed');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `Eid` varchar(100) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Urid` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`Eid`, `Email`, `Password`, `Urid`) VALUES
('0', 'admin@engeniasolutions.com.au', '123456', '3'),
('1', 'chamika@engeniasolutions.com.au', '1234', '3'),
('2', 'dilshan@engeniasolutions.com.au', 'qwer', '1');

-- --------------------------------------------------------

--
-- Table structure for table `usertypes`
--

CREATE TABLE `usertypes` (
  `Urid` varchar(100) NOT NULL,
  `UserType` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usertypes`
--

INSERT INTO `usertypes` (`Urid`, `UserType`) VALUES
('1', 'Employee'),
('2', 'HR'),
('3', 'Admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `authtoken_token`
--
ALTER TABLE `authtoken_token`
  ADD PRIMARY KEY (`key`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `auth_group`
--
ALTER TABLE `auth_group`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  ADD KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`);

--
-- Indexes for table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`);

--
-- Indexes for table `auth_user`
--
ALTER TABLE `auth_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  ADD KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`);

--
-- Indexes for table `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  ADD KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`);

--
-- Indexes for table `bankaccountdetails`
--
ALTER TABLE `bankaccountdetails`
  ADD PRIMARY KEY (`Eid`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`department_number`);

--
-- Indexes for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  ADD KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`);

--
-- Indexes for table `django_content_type`
--
ALTER TABLE `django_content_type`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`);

--
-- Indexes for table `django_migrations`
--
ALTER TABLE `django_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `django_session`
--
ALTER TABLE `django_session`
  ADD PRIMARY KEY (`session_key`),
  ADD KEY `django_session_expire_date_a5c62663` (`expire_date`);

--
-- Indexes for table `employeedetails`
--
ALTER TABLE `employeedetails`
  ADD PRIMARY KEY (`Eid`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`Eid`);

--
-- Indexes for table `expectedtrainingbudgets`
--
ALTER TABLE `expectedtrainingbudgets`
  ADD PRIMARY KEY (`Eid`);

--
-- Indexes for table `leaveapply`
--
ALTER TABLE `leaveapply`
  ADD PRIMARY KEY (`Lid`);

--
-- Indexes for table `leavebalance`
--
ALTER TABLE `leavebalance`
  ADD PRIMARY KEY (`Eid`);

--
-- Indexes for table `leaves`
--
ALTER TABLE `leaves`
  ADD PRIMARY KEY (`Lid`);

--
-- Indexes for table `resourceallocation`
--
ALTER TABLE `resourceallocation`
  ADD PRIMARY KEY (`AllocationID`);

--
-- Indexes for table `salary`
--
ALTER TABLE `salary`
  ADD PRIMARY KEY (`Eid`);

--
-- Indexes for table `salarypayments`
--
ALTER TABLE `salarypayments`
  ADD KEY `Eid` (`Eid`);

--
-- Indexes for table `token_blacklist_blacklistedtoken`
--
ALTER TABLE `token_blacklist_blacklistedtoken`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token_id` (`token_id`);

--
-- Indexes for table `token_blacklist_outstandingtoken`
--
ALTER TABLE `token_blacklist_outstandingtoken`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_uniq` (`jti`),
  ADD KEY `token_blacklist_outs_user_id_83bc629a_fk_auth_user` (`user_id`);

--
-- Indexes for table `training`
--
ALTER TABLE `training`
  ADD PRIMARY KEY (`Eid`);

--
-- Indexes for table `trainingapprovals`
--
ALTER TABLE `trainingapprovals`
  ADD PRIMARY KEY (`Eid`);

--
-- Indexes for table `trainingbudgetallocation`
--
ALTER TABLE `trainingbudgetallocation`
  ADD KEY `Eid` (`Eid`);

--
-- Indexes for table `trainingobjectives`
--
ALTER TABLE `trainingobjectives`
  ADD PRIMARY KEY (`ObjectiveID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`Email`);

--
-- Indexes for table `usertypes`
--
ALTER TABLE `usertypes`
  ADD PRIMARY KEY (`Urid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `auth_group`
--
ALTER TABLE `auth_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_permission`
--
ALTER TABLE `auth_permission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=109;

--
-- AUTO_INCREMENT for table `auth_user`
--
ALTER TABLE `auth_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `django_content_type`
--
ALTER TABLE `django_content_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `django_migrations`
--
ALTER TABLE `django_migrations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `employeedetails`
--
ALTER TABLE `employeedetails`
  MODIFY `Eid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `resourceallocation`
--
ALTER TABLE `resourceallocation`
  MODIFY `AllocationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `token_blacklist_blacklistedtoken`
--
ALTER TABLE `token_blacklist_blacklistedtoken`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `token_blacklist_outstandingtoken`
--
ALTER TABLE `token_blacklist_outstandingtoken`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `authtoken_token`
--
ALTER TABLE `authtoken_token`
  ADD CONSTRAINT `authtoken_token_user_id_35299eff_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`);

--
-- Constraints for table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`);

--
-- Constraints for table `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  ADD CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  ADD CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  ADD CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  ADD CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `leaveapply`
--
ALTER TABLE `leaveapply`
  ADD CONSTRAINT `leaveapply_ibfk_1` FOREIGN KEY (`Lid`) REFERENCES `leaves` (`Lid`);

--
-- Constraints for table `salarypayments`
--
ALTER TABLE `salarypayments`
  ADD CONSTRAINT `salarypayments_ibfk_1` FOREIGN KEY (`Eid`) REFERENCES `salary` (`Eid`);

--
-- Constraints for table `token_blacklist_blacklistedtoken`
--
ALTER TABLE `token_blacklist_blacklistedtoken`
  ADD CONSTRAINT `token_blacklist_blacklistedtoken_token_id_3cc7fe56_fk` FOREIGN KEY (`token_id`) REFERENCES `token_blacklist_outstandingtoken` (`id`);

--
-- Constraints for table `token_blacklist_outstandingtoken`
--
ALTER TABLE `token_blacklist_outstandingtoken`
  ADD CONSTRAINT `token_blacklist_outs_user_id_83bc629a_fk_auth_user` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `trainingbudgetallocation`
--
ALTER TABLE `trainingbudgetallocation`
  ADD CONSTRAINT `trainingbudgetallocation_ibfk_1` FOREIGN KEY (`Eid`) REFERENCES `training` (`Eid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
