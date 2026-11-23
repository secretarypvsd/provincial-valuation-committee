# Provincial Valuation Committee Dashboard — V7.3

GitHub Pages static dashboard สำหรับตรวจสอบกรรมการผู้ทรงคุณวุฒิประจำจังหวัด

## V7.3 — Executive Dashboard + Appointment Documents
- ใช้ V6.9 เป็นฐาน โดยคงการเชื่อม Google Sheets, แผนที่ 77 จังหวัด, ตัวกรอง, KPI, การแจ้งเตือน และ Timeline ครบวาระ 12 เดือน
- เพิ่มส่วน “เอกสารประกาศแต่งตั้งกรรมการ” สำหรับประกาศฉบับรวม 77 จังหวัด
- เพิ่มปุ่มเปิดดู PDF ผ่าน Google Drive และปุ่มดาวน์โหลด PDF
- ปรับ CSS ให้รองรับหน้าจอมือถือ

## การติดตั้งบน GitHub Pages
1. ดาวน์โหลดและแตกไฟล์ ZIP นี้
2. อัปโหลดไฟล์และโฟลเดอร์ทั้งหมดใน ZIP ไปยัง root ของ repository (แทนที่ไฟล์เดิม)
3. Commit และรอ GitHub Pages deploy

## Google Drive document
File ID: `1Kiqxx3OWguogP5o4DYd3189N0TxsJAIp`

ผู้ดู Dashboard ต้องได้รับสิทธิ์เข้าถึงไฟล์ PDF ตามนโยบายของหน่วยงาน หากไฟล์ไม่เปิด ให้ตรวจสอบการตั้งค่า Share ใน Google Drive

## หมายเหตุการทดสอบ
ไฟล์ชุดนี้จัดทำจาก V6.9 และตรวจสอบโครงสร้าง HTML/CSS และการมีอยู่ของไฟล์หลักใน ZIP แล้ว การเปิดไฟล์ PDF จริงและการทำงานของ Google Sheets ต้องตรวจสอบหลังเผยแพร่บน GitHub Pages ด้วยบัญชีผู้ใช้งานเป้าหมาย


V7.3 Clean Executive Edition: จัดลำดับเนื้อหาหน้าหลักให้โปร่งขึ้น และย้ายรายการประกาศแต่งตั้ง 5 ฉบับไว้ในส่วนพับ/ขยาย โดยคงลิงก์เปิดดูและดาวน์โหลด PDF แยกแต่ละฉบับ


## V8.0 — Premium Analytics Executive Edition
- Premium executive visual theme: deep forest green, warm ivory, and muted gold.
- Executive-first hierarchy with refined header, map panel, alert area, and expiry timeline.
- KPI strip now shows total committee members, provinces represented, current-year expiries, and expertise categories.
- KPI values follow the existing active filters.
- Preserves Google Sheets CSV source, province map, all existing filters, expiry timeline, alerts, quality checks, tables, appointment documents, CSV export, and print report controls.
- Built from V7.3; no backend or source-sheet schema changes.


## V8.1 — Colors 2027 Trend Edition
- Recolored the V8.0 executive dashboard using the supplied CEA Colors 2027 reference.
- Palette direction: warm ivory, moisture pink, lemon yellow, chocolate brown, vivid red, sweet pea green, pastel lilac, cool blue, and soft mint.
- Preserves the executive-first layout, Google Sheets integration, filters, map interactions, expiry timeline, alerts, appointment documents, and export/print controls.
- Map duplication/status colors remain unchanged so their existing meaning is not disrupted.


## V8 Executive Refresh — management mockup integration
- Adapted the supplied executive mockup's visual language: navy, muted gold, warm ivory, and clear management hierarchy.
- Added a live executive hero with a dynamically calculated upcoming expiry cohort from the connected Google Sheets data.
- Added four management insight cards: already expired, due within 90 days, due within 91–180 days, and the province with the largest record count.
- The mockup's static sample names and figures were not imported. Existing live Google Sheets remains the source of truth.
- Preserves the V8 filters, 77-province map, duplication legend, charts, alerts, 12-month expiry timeline, data-quality checks, appointment PDFs, CSV export, and print report.


## V8 Colors 2027 — Executive Palette Update
- Retains the V8 Executive Refresh layout and live management insight features.
- Replaces the navy-and-gold visual theme with the supplied Colors 2027 reference palette: warm ivory, moisture pink, lemon yellow, chocolate brown, red alert, sweet pea, pastel lilac, cool blue, and soft mint.
- Preserves functional map duplication colors and all existing data, filters, Google Sheets connection, timeline, alerts, reports, and appointment documents.


## V8 Executive — palette based on latest dashboard reference
- Replaced the Colors 2027 palette with the navy, gold, warm ivory, and white visual palette from the latest user-provided dashboard screenshot.
- Updated the four province-map duplication levels to soft mint, amber, muted blue, and brick red while preserving the original category meanings.
- Retains executive hero, management insights, Google Sheets source, all existing filters, province map, charts, expiry timeline, alerts, data-quality checks, appointment PDFs, CSV export, and print report.
