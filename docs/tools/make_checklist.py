import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from reportlab.pdfgen import canvas as rl_canvas
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table,
                                TableStyle, Flowable, KeepTogether)

OUT = sys.argv[1]
F = "C:/Windows/Fonts/"
pdfmetrics.registerFont(TTFont("Arial", F + "arial.ttf"))
pdfmetrics.registerFont(TTFont("Arial-Bold", F + "arialbd.ttf"))
pdfmetrics.registerFont(TTFont("Arial-Italic", F + "ariali.ttf"))
pdfmetrics.registerFont(TTFont("Calibri-Bold", F + "calibrib.ttf"))
registerFontFamily("Arial", normal="Arial", bold="Arial-Bold", italic="Arial-Italic", boldItalic="Arial-Bold")

NAVY = colors.HexColor("#1F4E79")
INK = colors.HexColor("#1F2933")
MUTED = colors.HexColor("#5B6775")
LIGHT = colors.HexColor("#F2F5F9")
LINE = colors.HexColor("#DCE3EA")
GOLD = colors.HexColor("#C9A227")

PAGE_W, PAGE_H = A4
LM = RM = 20 * mm
CONTENT_W = PAGE_W - LM - RM

h2 = ParagraphStyle("h2", fontName="Calibri-Bold", fontSize=15, leading=19, textColor=NAVY,
                    spaceBefore=14, spaceAfter=2)
body = ParagraphStyle("b", fontName="Arial", fontSize=9.8, leading=14.5, textColor=INK)
lead = ParagraphStyle("lead", parent=body, fontSize=10.2, leading=15.5)
note = ParagraphStyle("n", parent=body, fontSize=9, leading=13, textColor=MUTED)
item = ParagraphStyle("i", parent=body, fontSize=9.6, leading=13.6)
th = ParagraphStyle("th", fontName="Arial-Bold", fontSize=7.8, leading=10, textColor=MUTED)
bullet = ParagraphStyle("bl", parent=item, leftIndent=12, bulletIndent=0, spaceAfter=3)


class CheckBox(Flowable):
    def __init__(self, size=9.5):
        super().__init__()
        self.size = size
        self.width = self.height = size

    def draw(self):
        c = self.canv
        c.setStrokeColor(NAVY)
        c.setLineWidth(0.8)
        c.roundRect(0, 0, self.size, self.size, 1.5)


class Pill(Flowable):
    def __init__(self, required):
        super().__init__()
        self.required = required
        self.width, self.height = 17 * mm, 5.2 * mm

    def draw(self):
        c = self.canv
        label = "REQUIRED" if self.required else "OPTIONAL"
        if self.required:
            c.setFillColor(NAVY)
            c.setStrokeColor(NAVY)
            fill, txt = 1, colors.white
        else:
            c.setFillColor(colors.white)
            c.setStrokeColor(colors.HexColor("#9AA5B1"))
            fill, txt = 0, MUTED
        c.setLineWidth(0.7)
        c.roundRect(0, 0, self.width, self.height, self.height / 2, stroke=1, fill=fill)
        c.setFillColor(txt)
        c.setFont("Arial-Bold", 6.6)
        c.drawCentredString(self.width / 2, self.height / 2 - 2.3, label)


def section(num, heading, items, intro=None):
    rows = [["", Paragraph("ITEM", th), Paragraph("PRIORITY", th)]]
    for req, text in items:
        rows.append([CheckBox(), Paragraph(text, item), Pill(req == "R")])
    t = Table(rows, colWidths=[9 * mm, CONTENT_W - 9 * mm - 22 * mm, 22 * mm])
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, 0), 2),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 3),
        ("TOPPADDING", (0, 1), (0, -1), 8),
        ("TOPPADDING", (2, 1), (2, -1), 6.5),
        ("LEFTPADDING", (0, 0), (0, -1), 2),
        ("LEFTPADDING", (2, 0), (2, -1), 5),
        ("LINEBELOW", (0, 0), (-1, 0), 0.8, NAVY),
        ("LINEBELOW", (0, 1), (-1, -1), 0.5, LINE),
    ]))
    head = [Paragraph(f'<font color="#C9A227">{num:02d}</font>&nbsp;&nbsp;{heading}', h2)]
    if intro:
        head.append(Paragraph(intro, note))
    head.append(Spacer(1, 5))
    return [KeepTogether(head + [t])]


class NumberedCanvas(rl_canvas.Canvas):
    """Header band (page 1), running header (later pages) and 'Page X of Y' footer."""

    def __init__(self, *a, **k):
        super().__init__(*a, **k)
        self._saved = []

    def showPage(self):
        self._saved.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        total = len(self._saved)
        for state in self._saved:
            self.__dict__.update(state)
            self._decorate(total)
            super().showPage()
        super().save()

    def _decorate(self, total):
        n = self._pageNumber
        self.saveState()
        if n == 1:
            band_h = 46 * mm
            self.setFillColor(NAVY)
            self.rect(0, PAGE_H - band_h, PAGE_W, band_h, stroke=0, fill=1)
            self.setFillColor(GOLD)
            self.rect(0, PAGE_H - band_h - 1.6 * mm, PAGE_W, 1.6 * mm, stroke=0, fill=1)
            self.setFillColor(colors.HexColor("#BFD0E3"))
            self.setFont("Arial-Bold", 8.5)
            self.drawString(LM, PAGE_H - 15 * mm, "REDAC & ASSOCIATES")
            self.setFillColor(colors.white)
            self.setFont("Calibri-Bold", 25)
            self.drawString(LM, PAGE_H - 27 * mm, "Client Information Checklist")
            self.setFont("Arial", 10.5)
            self.setFillColor(colors.HexColor("#DCE6F1"))
            self.drawString(LM, PAGE_H - 35 * mm, "Website Design, Hosting & Search Engine Optimisation")
            self.setFont("Arial", 8.5)
            self.setFillColor(colors.HexColor("#BFD0E3"))
            self.drawRightString(PAGE_W - RM, PAGE_H - 15 * mm, "November 2026")
        else:
            self.setFont("Arial-Bold", 7.8)
            self.setFillColor(NAVY)
            self.drawString(LM, PAGE_H - 12 * mm, "REDAC & ASSOCIATES")
            self.setFont("Arial", 7.8)
            self.setFillColor(MUTED)
            self.drawRightString(PAGE_W - RM, PAGE_H - 12 * mm, "Client Information Checklist")
            self.setStrokeColor(LINE)
            self.setLineWidth(0.6)
            self.line(LM, PAGE_H - 14 * mm, PAGE_W - RM, PAGE_H - 14 * mm)
        self.setStrokeColor(LINE)
        self.setLineWidth(0.6)
        self.line(LM, 15 * mm, PAGE_W - RM, 15 * mm)
        self.setFont("Arial", 7.8)
        self.setFillColor(MUTED)
        self.drawString(LM, 10.5 * mm, "Confidential  \u2022  Prepared for REDAC & Associates")
        self.drawRightString(PAGE_W - RM, 10.5 * mm, f"Page {n} of {total}")
        self.restoreState()


story = [Spacer(1, 38 * mm)]

story += [
    Paragraph("Thank you for choosing us to build your new website. To begin design and development, "
              "we kindly ask you to provide the information and materials listed in this checklist.", lead),
    Spacer(1, 7),
]

legend = Table([
    [Pill(True), Paragraph("Needed before we can start, or before the website can go live.", note)],
    [Pill(False), Paragraph("Helpful, but not essential. Where it is not provided, we will prepare suitable "
                            "content for your approval.", note)],
], colWidths=[22 * mm, CONTENT_W - 22 * mm])
legend.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ("TOPPADDING", (0, 0), (-1, -1), 2.5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 2.5),
]))
story += [legend, Spacer(1, 10)]

summary_items = [
    "Access to your register.lk domain account",
    "Registered business name, registration number and contact details",
    "Business phone number, supporting document and assistance with listing verification",
    "Company logo",
    "Team member names, job titles and photographs",
    "Confirmation of services, with a short description of each",
    "Email address for website enquiries",
    "Consultation booking details and calendar",
    "Professional registrations and membership numbers",
    "Preferred contact method and best time to contact you for approvals",
]
srows = [[Paragraph("Required items at a glance",
                    ParagraphStyle("sh", parent=body, fontName="Calibri-Bold", fontSize=12.5,
                                   leading=16, textColor=NAVY))]]
srows += [[Paragraph(s, bullet, bulletText="\u2022")] for s in summary_items]
srows.append([Paragraph("The six-week project timeline begins once all required items have been received.",
                        ParagraphStyle("sn", parent=note, fontName="Arial-Italic"))])
st = Table(srows, colWidths=[CONTENT_W])
st.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), LIGHT),
    ("LINEBEFORE", (0, 0), (0, -1), 3, NAVY),
    ("LEFTPADDING", (0, 0), (-1, -1), 14),
    ("RIGHTPADDING", (0, 0), (-1, -1), 14),
    ("TOPPADDING", (0, 0), (-1, -1), 0),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ("TOPPADDING", (0, 0), (0, 0), 10),
    ("BOTTOMPADDING", (0, 0), (0, 0), 6),
    ("TOPPADDING", (0, -1), (0, -1), 5),
    ("BOTTOMPADDING", (0, -1), (0, -1), 10),
]))
story += [st]

story += section(1, "Domain and Website Access", [
    ("R", "<b>register.lk account login</b> (username and password). This allows us to connect your domain "
          "to the new website and install the SSL security certificate. "
          "<i>If register.lk sends a verification code to your phone or email, please be available to "
          "share it with us.</i>"),
    ("O", "<b>Existing website</b>, if any: the web address and admin login. This allows us to carry over "
          "existing content and redirect old pages to the new website."),
])

story += section(2, "Business Details", [
    ("R", "<b>Registered business name</b> and company registration number."),
    ("R", "<b>Contact details</b>: office address, phone number, email address and business hours, exactly "
          "as they should appear on the website."),
    ("O", "<b>Social media links</b> (e.g. Facebook, LinkedIn)."),
])

story += section(3, "Google, Bing and Apple Maps Listings", [
    ("R", "<b>Business phone number</b> for the listings. It must be able to receive a call or SMS, as "
          "verification codes may be sent to this number."),
    ("R", "<b>Assistance with verification.</b> Google may request a short video showing the office exterior "
          "(with business name or signage), the interior, and a business document. A staff member should be "
          "available to assist when required."),
    ("R", "<b>Supporting business document</b> showing the business name and address (e.g. business "
          "registration certificate or utility bill)."),
    ("R", "<b>Primary business category</b> (e.g. Accountant, Tax Consultant) and the areas you serve."),
    ("O", "<b>Listing photographs</b>: office exterior with signage, reception or interior, and team."),
    ("O", "<b>Business description</b> for the listings. If not provided, we will prepare one for your approval."),
], intro="We will create and set up your business listings on Google (Maps and Search), Bing Places and "
         "Apple Maps so that clients can find you easily.")

story += section(4, "Brand and Visual Identity", [
    ("R", "<b>Company logo</b> in high resolution (PNG or SVG format, not a screenshot)."),
    ("O", "<b>Brand colours and fonts</b>, if already defined."),
    ("O", "<b>Reference websites</b>: two or three websites whose style you like."),
])

story += section(5, "Team Profiles", [
    ("R", "For each team member to be featured: <b>full name, job title and a professional photograph</b>."),
    ("O", "<b>Qualifications and a short biography</b> (three to four lines) for each team member."),
])

story += section(6, "Services", [
    ("R", "<b>Confirmation of the service list</b>, including any additions or removals: Individual Tax "
          "Returns; Business Tax and Financial Reports; GST and BAS Services; Bookkeeping and Payroll; "
          "Business Advisory and Project Finance; Company Registration and ASIC Services; Corporate "
          "Administration; Tax Compliance."),
    ("R", "<b>A short description of each service</b>: what it involves and who it is for. "
          "Brief notes are sufficient; we will refine the wording."),
])

story += section(7, "Website Content", [
    ("O", "<b>About Us</b>: your story, the reason the business was founded, and what sets you apart."),
    ("O", "<b>Who We Help</b>: the types of clients you serve (individuals, small businesses, companies, etc.)."),
    ("O", "<b>Frequently Asked Questions</b>: five to ten questions clients commonly ask."),
    ("O", "<b>Photographs</b> of the office or team at work."),
    ("O", "<b>Existing written material</b>, such as a company profile or brochure, which we can edit "
          "and use on the website."),
    ("O", "<b>Privacy Policy and Disclaimer</b>, if available. Otherwise, we will prepare drafts for your review."),
])

story += section(8, "Enquiries and Bookings", [
    ("R", "<b>Email address</b> to receive enquiries submitted through the website contact form."),
    ("R", "<b>Consultation booking details</b>: who takes consultations, meeting duration, available "
          "days and times, and the email or calendar (Google or Outlook) where bookings should appear."),
    ("O", "<b>Automatic reply message</b> sent to clients after they submit an enquiry. If not provided, "
          "we will prepare one for your approval."),
])

story += section(9, "Professional Registrations", [
    ("R", "<b>Tax agent and professional registrations and memberships</b>, with registration numbers. "
          "These must be accurate before the website is published, so please verify them carefully."),
])

story += section(10, "Search Engine Optimisation (Monthly)", [
    ("O", "<b>Priority services and target locations</b>: the services you most want to promote and the "
          "cities or areas where you want to be found on Google."),
    ("O", "<b>Main competitors</b>: two or three firms you consider competitors."),
    ("O", "<b>Blog topic ideas</b>: subjects or common client questions you would like covered in the "
          "two monthly articles."),
    ("O", "<b>Associations and partners</b>: professional bodies, business networks or partner firms that "
          "may list or link to your website."),
], intro="We will manage your ongoing SEO, including keyword research, service page optimisation, "
         "listings management, link building and two blog articles per month. The items below are optional, "
         "but they help us focus on the work that matters most to your business.")

story += section(11, "Approvals and Communication", [
    ("R", "<b>Preferred contact method</b> for approvals and project updates (e.g. WhatsApp, phone call or "
          "email), with the relevant number or email address."),
    ("R", "<b>Preferred approval time</b>: the days and times that suit you best for us to contact you and "
          "for you to review and approve our work."),
], intro="Throughout the project, we will send you designs, pages and content to review and approve.")

closing = [
    Paragraph('<font color="#C9A227">12</font>&nbsp;&nbsp;Submission Guidelines', h2),
    Spacer(1, 4),
    Paragraph("Files may be sent by email or shared through a Google Drive or Dropbox folder.", bullet, bulletText="\u2022"),
    Paragraph("<b>For security, please send passwords separately</b> (e.g. by phone or WhatsApp), never in the "
              "same message as the username.", bullet, bulletText="\u2022"),
    Paragraph("Items may be provided in stages. We recommend sending the required items first.", bullet, bulletText="\u2022"),
]
story += [KeepTogether(closing)]

doc = SimpleDocTemplate(OUT, pagesize=A4, leftMargin=LM, rightMargin=RM,
                        topMargin=20 * mm, bottomMargin=21 * mm,
                        title="REDAC & Associates - Client Information Checklist",
                        author="Website Project Team",
                        subject="Website Design, Hosting & SEO")
doc.build(story, canvasmaker=NumberedCanvas)
print("ok", OUT)
