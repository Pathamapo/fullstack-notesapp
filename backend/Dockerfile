# ใช้ Node.js version ให้ใกล้เคียงกับที่คุณใช้รัน (v22)
FROM node:22-alpine

WORKDIR /app

# ก๊อปปี้ไฟล์ package เพื่อลง lib ก่อน
COPY package*.json ./
RUN npm install

# ก๊อปปี้โค้ดทั้งหมด (รวมโฟลเดอร์ config ที่มี .env ของคุณด้วย)
COPY . .

EXPOSE 5000

# ใช้ node server.js ตรงๆ สำหรับ Production ใน Container
CMD ["node", "server.js"]