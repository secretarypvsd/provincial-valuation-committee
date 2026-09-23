# Provincial Valuation Committee Dashboard

Dashboard สำหรับติดตามกรรมการผู้ทรงคุณวุฒิในคณะกรรมการประเมินราคาทรัพย์สินเพื่อประโยชน์แห่งรัฐประจำจังหวัด

## ไฟล์
- `index.html` หน้า Dashboard
- `styles.css` รูปแบบ Pastel Professional
- `app.js` ตัวกรอง การคำนวณสถานะ และกราฟ
- `data.js` ข้อมูลที่แปลงจากไฟล์ Excel ต้นฉบับ

## เปิดใช้งาน
เปิด `index.html` ในเว็บเบราว์เซอร์ หรืออัปโหลดทั้ง 4 ไฟล์ไปยัง GitHub repository แล้วเปิด GitHub Pages

## GitHub Pages
Repository ที่แนะนำ: `provincial-valuation-committee`

Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)` → Save

> หมายเหตุ: สถานะวันหมดวาระคำนวณจากวันที่ปัจจุบันของอุปกรณ์ผู้ใช้ และ “ใกล้หมดวาระ” หมายถึงเหลือไม่เกิน 365 วัน


## V4 Complete
- รวมไฟล์ `thailand-provinces.geojson` จำนวน 77 จังหวัดไว้ในโครงการแล้ว
- แผนที่โหลดจากไฟล์ภายใน repository ไม่พึ่ง CDN ภายนอก
- ชื่อจังหวัดเชื่อมด้วยฟิลด์ `ADM1_TH`


## V4.1
แผนที่ 77 จังหวัดถูกฝังเป็น `map-data.js` และโหลดเป็น JavaScript โดยตรงก่อน `app.js` จึงไม่ใช้ `fetch()` และไม่ขึ้นกับ MIME type หรือ path ของ GeoJSON บน GitHub Pages.
