# Chạy Jules tự động

`farm.mjs` chạy hàng đợi nhiệm vụ (`tasks.json`) trên nhiều khóa Jules, không cần ai trả lời. Mỗi khóa giữ tối đa 15 phiên cùng lúc và bắt đầu tối đa 100 nhiệm vụ mỗi ngày (UTC); phần còn lại đợi đến lượt. Phiên hỏi lại thì được bảo "tiếp tục, đừng hỏi", phiên lỗi thì chạy lại (tối đa 3 lần), phiên xong thì kiểm tra PR chỉ sửa đúng file được phép.

```bash
infisical run -- env JULES_KEYS="$KEY1,$KEY2" node tools/jules/farm.mjs tools/jules/tasks.json
```

Khóa chỉ đi qua biến môi trường, không ghi vào file, log hay prompt. Kết quả ở `tools/jules/state.json` (gitignore): trạng thái `ready` nghĩa là PR đã qua kiểm tra phạm vi và sẵn sàng để duyệt mẫu rồi gộp; `needs-fix` là PR sửa file ngoài phạm vi; `failed` là hết lượt thử. Công cụ này không bao giờ gộp PR.
