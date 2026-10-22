# HowToLiveBetter Global

Bản đa ngôn ngữ, đã bản địa hóa, của cuốn **高性价比人生指南** ([eternity4719/HowToLiveBetter](https://github.com/eternity4719/HowToLiveBetter)). Đây là một cẩm nang sống tính theo chi phí và lợi ích: mỗi mục ghi rõ bạn tốn gì, đổi lại được gì và chứng cứ mạnh tới đâu.

Dự án bám sát bản gốc tiếng Trung. Mỗi ngày nó lấy thay đổi mới, cho Claude dịch đúng những mục vừa đổi, rồi mở pull request để người duyệt.

Ngôn ngữ hiện có: **tiếng Việt** (`locales/vi`).

## Cách hoạt động

```
eternity4719/HowToLiveBetter  ──(npm run upstream)──►  .upstream/  (clone đầy đủ lịch sử)
                                                           │
                       locales/<lang>/sync.json  ◄── so hash từng mục (npm run status)
                                                           │
     mục mới / mục đổi ──► Claude (tools/translate.mjs, theo locales/<lang>/guide.md)
                                                           │
                       locales/<lang>/book/*.md  ──(npm run build)──►  dist/  ──►  Cloudflare Pages
```

- Mỗi mục có khóa cố định `phần/mục` (ví dụ `05/12`). `sync.json` lưu hash đoạn tiếng Trung mà bản dịch đang theo, nên lần sau chỉ dịch lại mục nào hash đổi.
- Mục bị đổi số nhưng nội dung giữ nguyên thì được chuyển số, không dịch lại.
- Với mục đã đổi, Claude nhận cả bản Trung cũ, bản Trung mới và bản dịch hiện tại, và chỉ sửa phần đã đổi để diff dễ duyệt.
- Nhãn chi phí (`<!-- tags: … -->`) là dữ liệu chung cho mọi ngôn ngữ, sinh tự động từ bản gốc, nên bộ lọc trên site chạy giống nhau ở mọi ngôn ngữ.
- Mục dựa trên luật hay thủ tục của Trung Quốc được đánh dấu `Chỉ tham khảo TQ:`. Bước dịch không tự bịa luật Việt Nam. Phần bổ sung cho Việt Nam sẽ do một bước bản địa hóa riêng viết, có trích nguồn chính thức.

## Lệnh

```bash
npm ci
npm run upstream                         # clone / cập nhật bản gốc vào .upstream/
npm run status -- vi --list              # mục nào mới, đổi, chuyển số, bị xóa
node tools/translate.mjs vi --dry-run    # xem prompt sẽ gửi
node tools/translate.mjs vi --only 01 --limit 5   # dịch thử 5 mục của phần 1
npm run build                            # tạo dist/
```

`translate.mjs` cần `ANTHROPIC_API_KEY`. Model mặc định là `claude-opus-5-5`, đổi bằng biến `TRANSLATE_MODEL`.

### Audio

`tools/audio.mjs` gọi bất kỳ endpoint TTS kiểu OpenAI nào (`POST <base>/audio/speech`), ví dụ gateway gemini-live-tts:

```bash
TTS_BASE_URL=http://127.0.0.1:8005/v1 TTS_API_KEY=<token> TTS_VOICE=podcast-nu \
AUDIO_BASE=https://audio.<domain> R2_BUCKET=<bucket> \
node tools/audio.mjs vi --only 01 --upload
```

Mỗi mục thành một file MP3 (`audio-out/vi/NN/N.mp3`). Mục nào nội dung đọc không đổi thì bỏ qua. `locales/vi/audio.json` ghi URL, và site tự hiện nút nghe cho các mục đã có audio.

## Triển khai lên Cloudflare Pages

1. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → chọn repo này.
2. Build command: `npm ci && npm run build`. Output directory: `dist`. Biến môi trường: `SITE_URL=https://<domain>`, `NODE_VERSION=22`.
3. Gắn domain riêng nếu có. Mỗi lần merge vào `main`, Pages tự build lại.

Đồng bộ tự động (`.github/workflows/sync.yml`) cần secret `ANTHROPIC_API_KEY` trong Settings → Secrets → Actions, và quyền "Allow GitHub Actions to create pull requests".

## Thêm một ngôn ngữ

Tạo `locales/<lang>/locale.json` (nhãn trường, chữ giao diện) và `locales/<lang>/guide.md` (quy tắc dịch và bản địa hóa), ghi `{"commit": null, "items": {}}` vào `sync.json`, rồi chạy `translate.mjs <lang>`.

## Nguồn và giấy phép

- Nội dung gốc: 高性价比人生指南 của [eternity4719](https://github.com/eternity4719/HowToLiveBetter), giấy phép [CC BY 4.0](LICENSE). Bản này đã dịch và chỉnh sửa; đây không phải bản chính thức (bản ebook chính thức do 果麦文化 phát hành).
- Bản tiếng Việt ban đầu lấy từ [chuanman2707/HowToLiveBetter](https://github.com/chuanman2707/HowToLiveBetter) (CC BY 4.0), đồng bộ với bản gốc tại commit `0cec2b3`, rồi cập nhật tiếp bằng công cụ trong repo này.
- Code: [MIT](LICENSE-CODE).
