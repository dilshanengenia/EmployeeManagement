#!/bin/bash
# Deployment script for EMS application on EC2

# Update system and install dependencies
echo "Updating system..."
sudo apt update && sudo apt upgrade -y

# Go to the project directory
cd ~/EmployeeManagement/EmsBackend

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install gunicorn

# Set up the database
echo "Setting up database..."
# (Database should already be created, if not, uncomment below)
# mysql -u root -p -e "CREATE DATABASE employeemanagement"

# Apply migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

# Restart Gunicorn
sudo systemctl restart gunicorn

# Check Gunicorn status
sudo systemctl status gunicorn

# Build frontend
echo "Building frontend..."
cd ../EMS-frontend
npm install
npm run build

# Update permissions
sudo chown -R www-data:www-data ../EMS-frontend/dist/

# Restart Nginx
sudo systemctl restart nginx

echo "Deployment complete! Application should be accessible at http://54.66.39.8"
