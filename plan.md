1. **Identify the 12 items:**
    1. ### 3. Cai thuốc đừng chỉ nhịn, trước hết lấy thuốc: dùng varenicline thì tỷ lệ thành công tăng hơn gấp đôi
    2. ### 5. Đi phòng khám cai thuốc, hoặc gọi 12320 hỏi địa phương có dịch vụ cai thuốc không
    3. ### 6. Cai không được rồi mới cân nhắc thuốc lá điện tử, người vốn không hút thuốc đừng động vào
    4. ### 10. Đánh răng kỹ, mỗi ngày làm sạch kẽ răng một lần, mất răng thì đi khám nha sĩ
    5. ### 12. Sau tuổi trưởng thành thì kiểm tra mỡ máu định kỳ: trước 40 tuổi 2 đến 5 năm một lần, từ 40 tuổi thì mỗi năm một lần; có tăng huyết áp, mỡ máu cao thì uống thuốc đều theo lời bác sĩ, đừng tự ý ngừng
    6. ### 21. Muốn uống ít rượu đi, trước hết đếm xem một tuần uống bao nhiêu, rồi nói với bác sĩ vài phút
    7. ### 25. Mỗi tuần uống trà ba lần trở lên
    8. ### 26. Mỗi ngày uống ba đến bốn tách cà phê, lượng caffeine tổng không quá 400 mg, không đường không kem phủ
    9. ### 31. Ban ngày ra ngoài phơi nắng chút, đừng cả ngày không thấy ánh sáng
    10. ### 36. Có điều kiện thì ngâm bồn tắm, đừng chỉ tắm vòi sen
    11. ### 40. Mua dầu ăn đóng gói sẵn có mã SC, đừng mua dầu lạc tự ép rời của xưởng nhỏ
    12. ### 41. Nấu ăn dùng dầu thực vật thay mỡ heo và bơ, không cần vì sức khỏe mà đổi loại dầu, cũng đừng trông dầu hạt lanh bảo vệ tim

2. **Research equivalents in Vietnam for each item (using `google_search` and `view_text_website` on `.gov.vn`, `vbpl.vn`, etc.):**
   - Item 3 (Smoking cessation drugs - Varenicline / Nicotine replacement in VN). Are they OTC or prescription?
   - Item 5 (Quit smoking clinics/hotline). Is there a hotline like 12320? (VN has 1800 6606 - Vinmec/Bach Mai Quitline? need official source, maybe vncdc.gov.vn)
   - Item 6 (E-cigarettes regulations in VN). Are they banned or managed?
   - Item 10 (Dental implants/insurance in VN). Does health insurance (BHYT) cover dental implants?
   - Item 12 (Cholesterol screening guidelines/insurance in VN). Guidelines by VN Heart Association?
   - Item 21 (Alcohol cessation medication in VN).
   - Item 25 (Tea and mycotoxins/aflatoxin standards in VN).
   - Item 26 (Hot drinks > 65C guidelines in VN? or general cancer guidelines).
   - Item 31 (Sun exposure in VN - UV index warnings?).
   - Item 36 (Bathtub drowning/safety in VN? Maybe no direct equivalent, "Chưa có thông tin đã kiểm chứng").
   - Item 40 (Cooking oil safety standard in VN - equivalent to SC code? QCVN, ATTP certificates?).
   - Item 41 (Cooking oil consumption recommendations in VN - Viện Dinh dưỡng Quốc gia?).

3. **Format the output in `locales/vi/local/02.md`:**
   - Add disclaimer at the top: `> Thông tin mang tính tham khảo, không thay thế tư vấn pháp lý. Kiểm tra lại nguồn chính thức trước khi áp dụng.`
   - For each item:
     - `### N. <title>`
     - `- Việt Nam: 1 to 4 plain Vietnamese sentences saying what applies in Vietnam (right, procedure, amount, deadline, who to contact).`
     - `- Nguồn VN: official sources only, as full URLs (domains like *.gov.vn, vbpl.vn, chinhphu.vn, quochoi.vn, or the official site of an international body), plus the law or document name and article number.`
     - `- Ngày tra cứu: YYYY-MM-DD (today).`
     - `- Độ tin cậy: đã kiểm chứng` (if all concrete claims backed by URL) or `chưa kiểm chứng` (if no official URL or only general principles).
     - If no info: `- Việt Nam: Chưa có thông tin đã kiểm chứng cho Việt Nam.` with `Độ tin cậy: chưa kiểm chứng`.

4. **Pre-commit and pull request:**
   - Call `pre_commit_instructions` tool to complete pre-commit steps.
   - Run `npm ci && npm run build`.
   - Submit the PR with the title "Việt Nam hóa phần 02" and description showing the count of `đã kiểm chứng` vs `chưa kiểm chứng`.
