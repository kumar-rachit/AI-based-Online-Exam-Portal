"""
Authentication routes for login, registration, and logout
"""

from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from utils.database import execute_query, execute_insert
from utils.helpers import hash_password, verify_password, validate_email, validate_password, validate_username
from utils.decorators import logout_required
from datetime import datetime

# Create Blueprint
auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/login', methods=['GET', 'POST'])
@logout_required
def login():
    """Handle user login"""
    if request.method == 'POST':
        email = request.form.get('email', '').strip()
        password = request.form.get('password', '')
        
        # Validate input
        if not email or not password:
            flash('Please provide both email and password.', 'danger')
            return render_template('login.html')
        
        # Query database for user
        query = """
            SELECT user_id, username, email, password_hash, full_name, role, is_active
            FROM users
            WHERE email = %s
        """
        user = execute_query(query, (email,), fetch='one')
        
        # Verify user exists and password is correct
        if user and verify_password(user['password_hash'], password):
            # Check if account is active
            if not user['is_active']:
                flash('Your account has been deactivated. Please contact administrator.', 'danger')
                return render_template('login.html')
            
            # Update last login time
            update_query = "UPDATE users SET last_login = %s WHERE user_id = %s"
            execute_query(update_query, (datetime.now(), user['user_id']), fetch=False)
            
            # Store user information in session
            session['user_id'] = str(user['user_id'])
            session['username'] = user['username']
            session['email'] = user['email']
            session['full_name'] = user['full_name']
            session['role'] = user['role']
            
            flash(f'Welcome back, {user["full_name"]}!', 'success')
            
            # Redirect based on role
            if user['role'] == 'admin':
                return redirect(url_for('admin.dashboard'))
            else:
                return redirect(url_for('student.dashboard'))
        else:
            flash('Invalid email or password.', 'danger')
    
    return render_template('login.html')


@auth_bp.route('/register', methods=['GET', 'POST'])
@logout_required
def register():
    """Handle user registration"""
    if request.method == 'POST':
        # Get form data
        username = request.form.get('username', '').strip()
        email = request.form.get('email', '').strip()
        password = request.form.get('password', '')
        confirm_password = request.form.get('confirm_password', '')
        full_name = request.form.get('full_name', '').strip()
        
        # Validate input
        if not all([username, email, password, confirm_password, full_name]):
            flash('All fields are required.', 'danger')
            return render_template('register.html')
        
        # Validate username
        is_valid_username, username_error = validate_username(username)
        if not is_valid_username:
            flash(username_error, 'danger')
            return render_template('register.html')
        
        # Validate email
        if not validate_email(email):
            flash('Invalid email format.', 'danger')
            return render_template('register.html')
        
        # Validate password
        is_valid_password, password_error = validate_password(password)
        if not is_valid_password:
            flash(password_error, 'danger')
            return render_template('register.html')
        
        # Check if passwords match
        if password != confirm_password:
            flash('Passwords do not match.', 'danger')
            return render_template('register.html')
        
        # Check if username already exists
        check_username = "SELECT user_id FROM users WHERE username = %s"
        if execute_query(check_username, (username,), fetch='one'):
            flash('Username already taken.', 'danger')
            return render_template('register.html')
        
        # Check if email already exists
        check_email = "SELECT user_id FROM users WHERE email = %s"
        if execute_query(check_email, (email,), fetch='one'):
            flash('Email already registered.', 'danger')
            return render_template('register.html')
        
        # Hash password and insert user
        password_hash = hash_password(password)
        
        insert_query = """
            INSERT INTO users (username, email, password_hash, full_name, role)
            VALUES (%s, %s, %s, %s, 'student')
        """
        
        user_id = execute_insert(insert_query, (username, email, password_hash, full_name))
        
        if user_id:
            flash('Registration successful! Please log in.', 'success')
            return redirect(url_for('auth.login'))
        else:
            flash('Registration failed. Please try again.', 'danger')
    
    return render_template('register.html')


@auth_bp.route('/logout')
def logout():
    """Handle user logout"""
    username = session.get('full_name', 'User')
    session.clear()
    flash(f'Goodbye, {username}! You have been logged out successfully.', 'info')
    return redirect(url_for('auth.login'))