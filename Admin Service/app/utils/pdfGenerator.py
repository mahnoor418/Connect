from fpdf import FPDF
from typing import List

def generate_activity_pdf(logs: List[dict]) -> bytes:
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)

    pdf.cell(200, 10, txt="Activity Log Report", ln=True, align="C")

    for i, log in enumerate(logs, start=1):
        pdf.ln(10)
        pdf.cell(200, 10, txt=f"#{i}", ln=True)
        pdf.cell(200, 10, txt=f"User: {log.get('email', 'N/A')}", ln=True)
        pdf.cell(200, 10, txt=f"Action: {log.get('action', 'N/A')}", ln=True)
        pdf.cell(200, 10, txt=f"Details: {log.get('details', 'N/A')}", ln=True)
        pdf.cell(200, 10, txt=f"Timestamp: {log.get('timestamp', 'N/A')}", ln=True)

    return pdf.output(dest='S')  # Already returns bytes
