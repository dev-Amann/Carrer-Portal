"""
Shared PDF styling constants and helpers
Extracted from pdf_generator.py to eliminate duplication between
create_career_report_pdf and create_career_comparison_pdf
"""
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT


def get_pdf_styles():
    """
    Returns a dict of custom PDF paragraph styles used across all report types.
    """
    styles = getSampleStyleSheet()
    
    custom = {
        'base': styles,
        'title': ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1e40af'),
            spaceAfter=12,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        ),
        'subtitle': ParagraphStyle(
            'CustomSubtitle',
            parent=styles['Normal'],
            fontSize=12,
            textColor=colors.HexColor('#666666'),
            spaceAfter=20,
            alignment=TA_CENTER
        ),
        'heading': ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#1e40af'),
            spaceAfter=10,
            spaceBefore=15,
            fontName='Helvetica-Bold'
        ),
        'body': ParagraphStyle(
            'CustomBody',
            parent=styles['Normal'],
            fontSize=11,
            textColor=colors.HexColor('#333333'),
            spaceAfter=10,
            leading=16
        ),
        'footer': ParagraphStyle(
            'Footer',
            parent=styles['Normal'],
            fontSize=9,
            textColor=colors.HexColor('#999999'),
            alignment=TA_CENTER
        ),
    }
    
    return custom


# Shared color constants
COLORS = {
    'primary': colors.HexColor('#1e40af'),
    'primary_light': colors.HexColor('#3b82f6'),
    'bg_light': colors.HexColor('#e0f2fe'),
    'bg_alt': colors.HexColor('#f0f9ff'),
    'text': colors.HexColor('#333333'),
    'text_muted': colors.HexColor('#666666'),
    'text_light': colors.HexColor('#999999'),
    'border': colors.HexColor('#cccccc'),
    'success': colors.HexColor('#10b981'),
    'success_light': colors.HexColor('#f0fdf4'),
    'warning': colors.HexColor('#f59e0b'),
    'warning_light': colors.HexColor('#fef3c7'),
}
