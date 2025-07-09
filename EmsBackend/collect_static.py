#!/usr/bin/env python
import os
import sys
import django

# Add the project path to the sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'EmsBackend.settings')
django.setup()

# Now that the environment is set up, we can import Django stuff
from django.core.management import call_command

if __name__ == '__main__':
    print('Collecting static files...')
    call_command('collectstatic', '--noinput')
    print('Static files collected.')
