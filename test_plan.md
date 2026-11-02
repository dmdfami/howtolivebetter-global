1. **Analyze Requirements and Source Material**
   - Read `locales/zh-Hant/book/24-section.md` to identify the 15 items with the `僅限中國大陸：` marker in their `備註` field.
   - For each item, I will use `google_search` to research the equivalent Taiwan regulations, policies, and procedures (e.g., Taiwan's National Health Insurance (NHI) system, hospital transfer regulations, emergency triage, disability certification, etc.).

2. **Execute Research (Concurrent Actions)**
   - I will search for official Taiwan sources for:
     - Item 1 & 2: NHI hospital transfer procedures and copayment (部分負擔) differences by hospital level.
     - Item 3: Referrals to large hospitals under NHI.
     - Item 4: Seeking medical care outside one's registered area (if applicable in Taiwan, though NHI is national).
     - Item 5 & 6: Medical records requests and preservation in case of medical disputes (醫療法).
     - Item 7: Emergency triage (急診五級檢傷分類基準).
     - Item 8: Emergency treatment for unidentified/unfunded patients (緊急醫療救護法).
     - Item 9: Disability assessment timing.
     - Item 10: Disability certification application (身心障礙證明).
     - Item 11: Red envelopes vs. appreciation (醫師法 or hospital policies).
     - Item 12: Dental implants and self-pay limits.
     - Item 13: NHI drug prescription outside hospitals (慢箋).
     - Item 14: Telemedicine and chronic disease prescriptions (通訊診察治療辦法).
     - Item 15: Hospital billing disputes.

3. **Format and Generate Target Content**
   - Create `locales/zh-Hant/local/24.md`.
   - Add the disclaimer: `> 僅供參考，非法律意見。行動前請先核對官方來源。`
   - For each of the 15 items, write the translation following exactly the required format:
     - `### N. <title>`
     - `- 在臺灣: <1-4 plain sentences>`
     - `- 官方來源: <URLs and citations>` or empty if unverified.
     - `- 查證日期: 2026-11-02`
     - `- 可信度: 已查證` or `未查證`

4. **Verification**
   - Run `cat locales/zh-Hant/local/24.md` to verify the generated content matches the structure perfectly.

5. **Project Build**
   - Run `npm ci && npm run build` to verify the project builds successfully.

6. **Pre-commit Checks**
   - Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.

7. **Submit Changes**
   - Use `git checkout -b local-zh-Hant-24` and standard git commands to commit the file.
   - Use the `submit` tool to finalize the task, creating a PR titled "local zh-Hant 24" containing the count of verified/unverified items.
