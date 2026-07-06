# Cấu trúc trang Review Sản Phẩm
# =============================

## Tổng quan
- **Tên:** Đánh Giá Số — Review sản phẩm công nghệ chuyên sâu
- **Mục đích:** Affiliate marketing (kiếm hoa hồng qua link shopee/tiki/shopify)
- **Stack:** HTML thuần + CSS + JS (không framework, tối ưu tốc độ)
- **Host dự kiến:** GitHub Pages (miễn phí)

## Cấu trúc thư mục
```
review-site/
├── index.html              # Trang chủ
├── assets/
│   ├── css/
│   │   └── style.css       # Stylesheet (tối ưu CRO)
│   ├── js/
│   │   ├── products.js     # Database sản phẩm
│   │   └── main.js         # Logic: filter, search, sort, modal
│   └── img/                # Ảnh local (nếu có)
└── pages/                  # Trang con cho từng sản phẩm
```

## Tính năng
1. **Filter theo danh mục** — Laptop, Tai Nghe, Màn Hình, Bàn Phím
2. **Tìm kiếm real-time** — Search theo tên, tags, mô tả
3. **Sắp xếp** — Mới nhất, đánh giá, giá
4. **Product Card** — Badge (Best/Hot/New), rating, tags
5. **Modal chi tiết** — Ưu/nhược điểm, các tags, button affiliate
6. **Responsive** — Mobile-first
7. **Newsletter** — Form đăng ký email
8. **Sticky filter bar** — Tiện lợi khi scroll

## Nguồn ảnh
- Từ Pexels API (key `S8PgN…`) — ảnh stock miễn phí bản quyền
- Fallback ảnh mặc định nếu ảnh lỗi

## Kế hoạch deploy
1. Tạo GitHub repo `review` → GitHub Pages
2. Hoặc host qua n8n static server
3. Thêm tracking (GA4)
4. Tích hợp n8n workflow để cập nhật sản phẩm tự động

## Danh sách sản phẩm mẫu (9 sản phẩm)
1. MacBook Air M3 13" - Laptop
2. ASUS ROG Zephyrus G14 - Laptop  
3. Logitech G Pro X Superlight 2 - Chuột
4. Keychron Q1 Pro - Bàn Phím
5. Sony WH-1000XM5 - Tai Nghe
6. AirPods Pro 2 - Tai Nghe
7. Razer BlackShark V2 Pro 2023 - Tai Nghe
8. LG 27" 4K Nano IPS - Màn Hình
9. DJI Osmo Pocket 3 - Camera

## Cần làm tiếp
- [ ] Tạo GitHub token (PAT) — cần quyền `repo` + `workflow`
- [ ] Push code lên repo
- [ ] Bật GitHub Pages
- [ ] Thêm Google Analytics
- [ ] Thêm link affiliate thật (Shopee, Tiki, Amazon)
- [ ] Tạo workflow n8n tự động đăng bài mới
- [ ] SEO: sitemap.xml, robots.txt, meta tags