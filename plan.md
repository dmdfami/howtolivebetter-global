1. We need to create a new file `locales/tr/local/26.md`.
2. The file will start with the specific header.
3. Then we will generate 13 blocks for the 13 items.
4. Since we cannot reach the Turkish official sources like `mevzuat.gov.tr` (connection timed out in duckduckgo and google searches, directly as well), and we cannot invent laws, URLs, or hotlines, we will use the fallback:
   `- Türkiye'de: Türkiye için henüz doğrulanmış bilgi yok.`
   `- Resmî kaynaklar: ` (empty)
   `- Kontrol tarihi: 2026-11-02`
   `- Güvenilirlik: doğrulanmadı`
5. Since all 13 items will not be verified with a concrete official link that we actually opened, we will set them all to `doğrulanmadı`.
6. Run `npm ci && npm run build` to verify the build.
7. Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
8. Submit the PR using `gh pr create --title "local tr 26" --body "0 items doğrulanmadı, 13 items doğrulanmadı"`. Wait, the body should mention "0 items doğrulandı, 13 items doğrulanmadı". Or we just use standard CLI to open the PR.
