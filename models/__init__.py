# =====================================================
# Create these __init__.py files in their respective directories
# =====================================================

# ====================
# models/__init__.py
# ====================
"""
Models package initialization
"""

# ====================
# routes/__init__.py
# ====================
"""
Routes package initialization
"""
from . import auth, admin, student, exam

# ====================
# utils/__init__.py
# ====================
"""
Utilities package initialization
"""
from . import database, decorators, helpers

__all__ = ['database', 'decorators', 'helpers']