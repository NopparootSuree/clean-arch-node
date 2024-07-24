# วิธีการ Merge แบบแยก Branch

## ขั้นตอนการ Merge โดยใช้ Integration Branch

การใช้ integration branch เป็นวิธีที่ช่วยลดความเสี่ยงในการ merge code เข้าสู่ main branch โดยเฉพาะในโปรเจกต์ขนาดใหญ่หรือทีมที่มีหลายคน

### 1. สร้าง Integration Branch

สร้าง branch ใหม่จาก main เพื่อใช้เป็น integration branch:

git checkout main
git pull
git checkout -b integration/feature-name

### 2. Merge Feature Branch เข้า Integration Branch

นำ code จาก feature branch มา merge เข้า integration branch:

git merge feature/feature-name

### 3. แก้ไข Conflicts และทดสอบ

- แก้ไข conflicts (ถ้ามี)
- ทดสอบการทำงานของ code ให้แน่ใจว่าทุกอย่างทำงานได้ถูกต้อง
- แก้ไขปัญหาที่อาจเกิดขึ้นในขั้นตอนนี้

### 4. Code Review

- Push integration branch ไปยัง remote repository
- สร้าง Pull Request จาก integration branch ไปยัง main
- ให้ทีมตรวจสอบ code และให้ feedback

### 5. Merge เข้า Main

เมื่อผ่านการ review และทดสอบแล้ว ให้ merge integration branch เข้า main:

git checkout main
git merge integration/feature-name

### 6. Push to Remote

Push การเปลี่ยนแปลงไปยัง remote repository:

git push origin main

### 7. ทำความสะอาด

ลบ integration branch และ feature branch ที่ไม่ใช้แล้ว:

git branch -d integration/feature-name
git branch -d feature/feature-name
git push origin --delete integration/feature-name
git push origin --delete feature/feature-name

## ข้อควรระวัง

- ตรวจสอบให้แน่ใจว่าได้ pull latest changes จาก main ก่อนเริ่มกระบวนการเสมอ
- ทดสอบ code อย่างละเอียดในทุกขั้นตอน
- ใช้ meaningful commit messages เพื่อให้เข้าใจการเปลี่ยนแปลงได้ง่าย
- หากมีปัญหาเกิดขึ้น อย่าลังเลที่จะขอความช่วยเหลือจากทีม

การใช้วิธีนี้จะช่วยให้การ merge code มีความปลอดภัยและมีประสิทธิภาพมากขึ้น