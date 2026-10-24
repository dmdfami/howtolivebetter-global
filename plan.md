1. **Prepare Output Format & Content Draft:**
   - Create a string with the required markdown format, starting with the disclaimer: `> Thông tin mang tính tham khảo, không thay thế tư vấn pháp lý. Kiểm tra lại nguồn chính thức trước khi áp dụng.`
   - Draft Vietnamese localized block for **Item 17 (hiến máu)** using `Thông tư 26/2013/TT-BYT` which dictates rules around blood donation intervals and benefits. (Source: `https://vbpl.vn/van-ban/chi-tiet/thong-tu-so-26-2013-tt-byt-huong-dan-hoat-dong-truyen-mau--46980`). Rating: `đã kiểm chứng`.
   - Draft Vietnamese localized block for **Item 18 (gói khám sức khỏe)** using `Thông tư 35/2011/TT-BYT` covering free health checkups for the elderly. (Source: `https://vbpl.vn/van-ban/chi-tiet/thong-tu-so-35-2011-tt-byt-huong-dan-thuc-hien-cham-soc-suc-khoe-nguoi-cao-tuoi--27085`). Rating: `đã kiểm chứng`.
   - Draft Vietnamese localized block for **Item 28 (chữa đồng tính)** based on the Ministry of Health's guideline banning conversion therapy (`Công văn 4132/BYT-PC`). (Source: `https://pbgdpl.camau.gov.vn/chan-chinh-cong-tac-kham-benh-chua-benh-doi-voi-nguoi-dong-tinh-song-tinh-va-chuyen-gioi.2570` as an official `gov.vn` portal). Rating: `đã kiểm chứng`.
   - Draft Vietnamese localized block for **Item 31 (chatbot AI)**. Write general advice on seeking legal/medical advice rather than relying on AI. (Source: `Chưa có thông tin đã kiểm chứng cho Việt Nam`). Rating: `chưa kiểm chứng`.
   - Draft Vietnamese localized block for **Item 34 (melatonin)** using `Thông tư 43/2014/TT-BYT` stating dietary supplements must be labelled "Sản phẩm này không phải là thuốc và không có tác dụng thay thế thuốc chữa bệnh". (Source: `https://vbpl.vn/van-ban/chi-tiet/thong-tu-so-43-2014-tt-byt-ve-quan-ly-thuc-pham-chuc-nang--44370`). Rating: `đã kiểm chứng`.
   - Draft Vietnamese localized block for **Item 35 (truyền dịch)**. State that in Vietnam, IV drips should be administered according to doctors' orders, but mark as "Chưa có thông tin đã kiểm chứng cho Việt Nam". Rating: `chưa kiểm chứng`.

2. **Execute File Creation:**
   - Use `write_file` tool to save the drafted text to `locales/vi/local/06.md`.

3. **Verification:**
   - Read `locales/vi/local/06.md` using `read_file` to ensure formatting adheres to instructions (one block per item, correct ordering).
   - Ensure the disclaimer is at the top.

4. **Testing / Pre-commit Step:**
   - Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done (will invoke `pre_commit_instructions`).
   - Run `npm ci && npm run build` to verify the new build succeeds.

5. **Submission:**
   - Commit changes and open a pull request using the `submit` tool with title "Việt Nam hóa phần 06" and message detailing the 4 `đã kiểm chứng` and 2 `chưa kiểm chứng` items.
