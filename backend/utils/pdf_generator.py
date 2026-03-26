"""
PDF Generator for Career Reports
Creates styled PDF reports for career recommendations
"""
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.platypus import Image as RLImage
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from io import BytesIO
import logging

from utils.pdf_styles import get_pdf_styles, COLORS

logger = logging.getLogger(__name__)


def create_career_report_pdf(user_data, career_data, skill_gap_data):
    """
    Generate a PDF report for career recommendation
    
    Args:
        user_data (dict): User information
        career_data (dict): Career details
        skill_gap_data (dict): Skill gap analysis
    
    Returns:
        BytesIO: PDF file as bytes
    """
    try:
        # Create PDF buffer
        buffer = BytesIO()
        
        # Create PDF document
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=0.75*inch,
            leftMargin=0.75*inch,
            topMargin=0.75*inch,
            bottomMargin=0.75*inch
        )
        
        # Container for PDF elements
        elements = []
        
        # Get shared styles
        pdf_styles = get_pdf_styles()
        title_style = pdf_styles['title']
        subtitle_style = pdf_styles['subtitle']
        heading_style = pdf_styles['heading']
        body_style = pdf_styles['body']
        footer_style = pdf_styles['footer']
        
        # Header
        elements.append(Paragraph("🎯 Career Recommendation Report", title_style))
        elements.append(Paragraph("Personalized Career Guidance from CareerPortal", subtitle_style))
        elements.append(Spacer(1, 0.2*inch))
        
        # User Info
        elements.append(Paragraph(f"<b>Prepared for:</b> {user_data['name']}", body_style))
        elements.append(Paragraph(f"<b>Email:</b> {user_data['email']}", body_style))
        elements.append(Spacer(1, 0.3*inch))
        
        # Career Title
        elements.append(Paragraph(f"<b>{career_data['title']}</b>", heading_style))
        elements.append(Paragraph(career_data['description'], body_style))
        elements.append(Spacer(1, 0.2*inch))
        
        # Career Details Table
        career_details = [
            ['Salary Range', career_data.get('salary_range', 'N/A')],
            ['Market Demand', career_data.get('demand_level', 'N/A').replace('_', ' ').upper()],
            ['Skills Matched', f"{skill_gap_data['met_skills_count']}/{skill_gap_data['total_required_skills']}"],
            ['Career Readiness', f"{skill_gap_data['readiness_percentage']:.0f}%"]
        ]
        
        career_table = Table(career_details, colWidths=[2*inch, 4*inch])
        career_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#e0f2fe')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#333333')),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('TOPPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#cccccc')),
        ]))
        
        elements.append(career_table)
        elements.append(Spacer(1, 0.3*inch))
        
        # Skills You Have
        if skill_gap_data['met_requirements']:
            elements.append(Paragraph("✅ Skills You Already Have", heading_style))
            
            met_skills_data = [['Skill Name', 'Current Level', 'Required Level']]
            for skill in skill_gap_data['met_requirements']:
                met_skills_data.append([
                    skill['skill_name'],
                    skill['current_level'],
                    skill['required_level']
                ])
            
            met_skills_table = Table(met_skills_data, colWidths=[2.5*inch, 1.75*inch, 1.75*inch])
            met_skills_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#10b981')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                ('TOPPADDING', (0, 0), (-1, -1), 8),
                ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#cccccc')),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f0fdf4')])
            ]))
            
            elements.append(met_skills_table)
            elements.append(Spacer(1, 0.2*inch))
        
        # Skills to Develop
        if skill_gap_data['gaps']:
            elements.append(Paragraph("📚 Skills to Develop", heading_style))
            
            gap_skills_data = [['Skill Name', 'Current Level', 'Target Level']]
            for skill in skill_gap_data['gaps']:
                gap_skills_data.append([
                    skill['skill_name'],
                    skill.get('current_level', 'Not acquired'),
                    skill['required_level']
                ])
            
            gap_skills_table = Table(gap_skills_data, colWidths=[2.5*inch, 1.75*inch, 1.75*inch])
            gap_skills_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f59e0b')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                ('TOPPADDING', (0, 0), (-1, -1), 8),
                ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#cccccc')),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#fef3c7')])
            ]))
            
            elements.append(gap_skills_table)
            elements.append(Spacer(1, 0.2*inch))
        
        # Learning Roadmap
        if career_data.get('roadmap'):
            elements.append(Paragraph("🗺️ Your Learning Roadmap", heading_style))
            elements.append(Paragraph(career_data['roadmap'], body_style))
            elements.append(Spacer(1, 0.2*inch))
        
        # Pro Tip
        elements.append(Spacer(1, 0.3*inch))
        tip_style = ParagraphStyle(
            'Tip',
            parent=body_style,
            backColor=colors.HexColor('#e0f2fe'),
            borderPadding=10,
            borderColor=colors.HexColor('#3b82f6'),
            borderWidth=1,
            borderRadius=5
        )
        elements.append(Paragraph(
            "<b>💡 Pro Tip:</b> Focus on developing the missing skills one at a time. "
            "Consider booking a consultation with our experts for personalized guidance on your career transition.",
            tip_style
        ))
        
        # Footer
        elements.append(Spacer(1, 0.5*inch))
        elements.append(Paragraph(
            "CareerPortal - Your Partner in Career Growth<br/>"
            "© 2025 CareerPortal. All rights reserved.",
            footer_style
        ))
        
        # Build PDF
        doc.build(elements)
        
        # Get PDF bytes
        buffer.seek(0)
        return buffer
        
    except Exception as e:
        logger.error(f"Error generating PDF: {str(e)}")
        raise



def create_career_comparison_pdf(user_data, comparison_data):
    """
    Generate a PDF comparison report for multiple careers
    
    Args:
        user_data (dict): User information
        comparison_data (list): List of career comparison data
    
    Returns:
        BytesIO: PDF file as bytes
    """
    try:
        # Create PDF buffer
        buffer = BytesIO()
        
        # Create PDF document
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=0.75*inch,
            leftMargin=0.75*inch,
            topMargin=0.75*inch,
            bottomMargin=0.75*inch
        )
        
        # Container for PDF elements
        elements = []
        
        # Get shared styles
        pdf_styles = get_pdf_styles()
        title_style = pdf_styles['title']
        subtitle_style = pdf_styles['subtitle']
        heading_style = pdf_styles['heading']
        body_style = pdf_styles['body']
        footer_style = pdf_styles['footer']
        
        # Header
        elements.append(Paragraph("🎯 Career Comparison Report", title_style))
        elements.append(Paragraph(f"Comparing {len(comparison_data)} Careers", subtitle_style))
        elements.append(Spacer(1, 0.2*inch))
        
        # User Info
        elements.append(Paragraph(f"<b>Prepared for:</b> {user_data['name']}", body_style))
        elements.append(Paragraph(f"<b>Email:</b> {user_data['email']}", body_style))
        elements.append(Spacer(1, 0.3*inch))
        
        # Comparison Table
        table_data = [['Criteria'] + [c['career']['title'] for c in comparison_data]]
        
        # Add rows
        table_data.append(['Salary Range'] + [c['career'].get('salary_range', 'N/A') for c in comparison_data])
        table_data.append(['Market Demand'] + [c['career'].get('demand_level', 'N/A').replace('_', ' ').upper() for c in comparison_data])
        table_data.append(['Skills Match'] + [f"{c['matched_skills']}/{c['total_skills']}" for c in comparison_data])
        table_data.append(['Readiness'] + [f"{c['readiness_percentage']:.0f}%" for c in comparison_data])
        
        # Calculate column widths
        col_width = 6.5 / (len(comparison_data) + 1)
        col_widths = [col_width*inch] * (len(comparison_data) + 1)
        
        comparison_table = Table(table_data, colWidths=col_widths)
        comparison_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3b82f6')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
            ('TOPPADDING', (0, 0), (-1, -1), 10),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#cccccc')),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f0f9ff')])
        ]))
        
        elements.append(comparison_table)
        elements.append(Spacer(1, 0.3*inch))
        
        # Individual Career Details
        for idx, career_data in enumerate(comparison_data, 1):
            career = career_data['career']
            
            elements.append(Paragraph(f"{idx}. {career['title']}", heading_style))
            elements.append(Paragraph(career['description'], body_style))
            
            # Career stats
            stats_data = [
                ['Salary Range', career.get('salary_range', 'N/A')],
                ['Market Demand', career.get('demand_level', 'N/A').replace('_', ' ').upper()],
                ['Skills Match', f"{career_data['matched_skills']}/{career_data['total_skills']}"],
                ['Career Readiness', f"{career_data['readiness_percentage']:.0f}%"]
            ]
            
            stats_table = Table(stats_data, colWidths=[2*inch, 4*inch])
            stats_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#e0f2fe')),
                ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#333333')),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                ('TOPPADDING', (0, 0), (-1, -1), 8),
                ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#cccccc')),
            ]))
            
            elements.append(stats_table)
            elements.append(Spacer(1, 0.2*inch))
        
        # Footer
        elements.append(Spacer(1, 0.3*inch))
        elements.append(Paragraph(
            "CareerPortal - Your Partner in Career Growth<br/>"
            "© 2025 CareerPortal. All rights reserved.",
            footer_style
        ))
        
        # Build PDF
        doc.build(elements)
        
        # Get PDF bytes
        buffer.seek(0)
        return buffer
        
    except Exception as e:
        logger.error(f"Error generating comparison PDF: {str(e)}")
        raise
