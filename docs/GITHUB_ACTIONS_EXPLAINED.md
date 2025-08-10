# 📚 GitHub Actions Jobs Explained

## 🔍 Tổng quan về GitHub Actions

GitHub Actions là một hệ thống CI/CD tự động hóa các tác vụ trong repository của bạn.

### 📁 Cấu trúc Workflow

```yaml
name: Dependency Management    # Tên workflow
on: [events]                  # Sự kiện kích hoạt
jobs:                         # Danh sách công việc
  job-name:                   # Tên job
    runs-on: ubuntu-latest    # Môi trường chạy
    steps:                    # Các bước thực hiện
      - name: Step 1
        run: command
```

## 🛡️ Job: `security-updates`

### Mục đích:
- **Tự động kiểm tra** các lỗ hổng bảo mật trong dependencies
- **Tự động sửa** các vấn đề bảo mật
- **Tạo Pull Request** với các cập nhật bảo mật

### Khi nào chạy:
```yaml
if: github.event.inputs.update_type == 'security' || github.event.schedule
```
- Khi chọn 'security' trong manual trigger
- Hoặc khi chạy theo lịch (mỗi thứ 2)

### Các bước thực hiện:

#### 1. Checkout code
```yaml
- name: Checkout code
  uses: actions/checkout@v4
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
```
**Làm gì:** Tải source code về máy chủ GitHub

#### 2. Setup Node.js
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'
```
**Làm gì:** Cài đặt Node.js version 20 và cache npm

#### 3. Install tools
```yaml
- name: Install npm-check-updates
  run: npm install -g npm-check-updates
```
**Làm gì:** Cài đặt công cụ kiểm tra cập nhật

#### 4. Check vulnerabilities
```yaml
- name: Check for security vulnerabilities
  run: npm audit --audit-level=moderate
```
**Làm gì:** Kiểm tra các lỗ hổng bảo mật mức độ vừa trở lên

#### 5. Fix vulnerabilities
```yaml
- name: Fix security vulnerabilities
  run: npm audit fix
```
**Làm gì:** Tự động sửa các lỗ hổng bảo mật

#### 6. Update package-lock.json
```yaml
- name: Update package-lock.json
  run: npm install
```
**Làm gì:** Cập nhật file lock để đảm bảo consistency

#### 7. Create Pull Request
```yaml
- name: Create Pull Request
  uses: peter-evans/create-pull-request@v5
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    commit-message: 'fix: update dependencies to fix security vulnerabilities'
    title: 'Security Updates - Dependency Fixes'
    body: |
      ## Security Updates
      
      This PR contains automatic security updates for npm dependencies.
    branch: security-updates
    delete-branch: true
```
**Làm gì:** Tạo Pull Request với các thay đổi bảo mật

## 🔄 Job: `dependency-updates`

### Mục đích:
- Cập nhật các dependencies lên **minor versions** mới nhất
- Đảm bảo không có breaking changes

### Khi nào chạy:
```yaml
if: github.event.inputs.update_type == 'minor' || github.event.inputs.update_type == 'all'
```

### Điểm khác biệt:
- Sử dụng `ncu -u --target minor` thay vì `npm audit fix`
- Chạy tests để đảm bảo không bị lỗi
- Tạo PR riêng cho minor updates

## 🚀 Job: `major-updates`

### Mục đích:
- Kiểm tra các **major updates** có sẵn
- **KHÔNG tự động cập nhật** (vì có thể có breaking changes)
- Tạo report về các major updates

### Điểm đặc biệt:
- Chỉ tạo **issue/comment** với thông tin
- Không tự động thay đổi code
- Cần review thủ công

## 🔍 Job: `vulnerability-scan`

### Mục đích:
- Scan toàn diện với **multiple tools**
- Sử dụng Snyk và OWASP Dependency Check
- Upload kết quả lên GitHub Security

### Tools sử dụng:
1. **Snyk**: Commercial security scanner
2. **OWASP**: Open source security scanner
3. **GitHub CodeQL**: Tích hợp với GitHub Security

## 🎯 Workflow Flow

```
Manual Trigger hoặc Schedule
           ↓
    Chọn update_type
           ↓
┌─────────────────────────────────┐
│     security-updates            │
│  - Kiểm tra vulnerabilities     │
│  - Auto fix                     │
│  - Tạo PR                       │
└─────────────────────────────────┘
           ↓ (nếu chọn 'minor' hoặc 'all')
┌─────────────────────────────────┐
│    dependency-updates           │
│  - Update minor versions        │
│  - Run tests                    │
│  - Tạo PR                       │
└─────────────────────────────────┘
           ↓ (nếu chọn 'all')
┌─────────────────────────────────┐
│     major-updates               │
│  - Check major updates          │
│  - Tạo report                   │
│  - Tạo issue                    │
└─────────────────────────────────┘
           ↓ (luôn chạy)
┌─────────────────────────────────┐
│    vulnerability-scan           │
│  - Scan với Snyk               │
│  - Scan với OWASP              │
│  - Upload results               │
└─────────────────────────────────┘
```

## 🔐 Secrets cần thiết

Để workflow hoạt động đầy đủ, cần configure các secrets:

```yaml
# Trong GitHub Repository Settings > Secrets
GITHUB_TOKEN    # Tự động có sẵn
SNYK_TOKEN      # Cần đăng ký Snyk account
CODECOV_TOKEN   # Nếu sử dụng Codecov
```

## 📊 Monitoring & Results

1. **Security Updates**: Tạo PR tự động
2. **Dependency Updates**: Tạo PR với tests passed
3. **Major Updates**: Tạo issue với recommendation
4. **Vulnerability Scan**: Upload lên GitHub Security tab

## ✅ Best Practices

1. **Review tất cả PRs** trước khi merge
2. **Test thoroughly** sau khi merge
3. **Monitor security alerts** trong GitHub
4. **Schedule regular reviews** của major updates
5. **Keep secrets up to date**

## 🚨 Troubleshooting

### Nếu workflow fail:
1. Check logs trong Actions tab
2. Verify secrets configuration
3. Check Node.js version compatibility
4. Review dependency conflicts

### Nếu tests fail:
1. Run tests locally trước
2. Check breaking changes in updates
3. Update test cases nếu cần
4. Consider rollback nếu critical

## 📝 Customization

Bạn có thể tùy chỉnh:
- **Cron schedule**: Thay đổi thời gian chạy
- **Audit levels**: moderate, high, critical
- **Target updates**: patch, minor, major
- **PR templates**: Customize message và body
- **Branch naming**: Đổi tên branch strategy
