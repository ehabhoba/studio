# **App Name**: أستاذ صيانة (Ustad Siana)

## Core Features:

- Request Submission: Client-side form for submitting maintenance requests, including image upload, description, phone number, and geolocation using Geolocation API.
- AI Image Analysis: Automatically analyze uploaded images to detect the potential maintenance problem, using the Hugging Face API with the resnet-50 model; use of AI will be exposed as a tool.
- Data Submission: Webhook integration to send client request data (including AI analysis results) to a Google Sheet with Spreadsheet ID: 1o5w6c5WT3DdTo7Zi354SiNN0Atz43KCa63RBwFkbMRU and Webhook URL: https://script.google.com/macros/s/AKfycbxOTeXdmO7YRTLl5jjAPqBmHa7ef4YglG2TSb4eORXRzLw0gefkN5bNWV5k1ww5dPFSPA/exec.
- Worker Registration: Worker registration form for entering name, phone number, specialization, city, and experience summary; workers will send data to `workers_sheet`
- Request Tracking: Request tracking page where clients can enter their phone number to view the status of their request, pulling data from Google Sheets.
- Admin Authentication: Admin login page with manual authentication (email: ehabgm@ehabgm.com, password: P@ssw0rd) and session management using localStorage.
- Admin Dashboard: Admin dashboard to view client requests (with AI results), manage worker data, and manually assign workers to clients.
- Email Notification: Send email upon receiving a new request using EmailJS with Gmail (Service ID: service_si538yu).
- PDF Generation: Generate and download requests as PDF files using jsPDF.

## Style Guidelines:

- Primary color: Sandy Yellow (#F4D03F), inspired by the image of the desert, to evoke reliability, quality and warmth in middle eastern climate and design.
- Background color: Light-beige (#F9F6F2), desaturated to ensure legibility of text in a light color scheme, referencing classic utility and reliability.
- Accent color: Orange-red (#E74C3C), slightly to the 'left' of sandy yellow on the color wheel to catch the eye and to serve as a signal of criticality where needed in the context of home repair.
- Font: 'Inter' (sans-serif) for both body and headings to achieve a modern, machined, objective and neutral look.
- Simple, clear icons representing maintenance categories.
- Right-to-left (RTL) layout for Arabic language support.
- Subtle transitions and loading animations to enhance user experience. The design will be formatted using Bootstrap or Tailwind.