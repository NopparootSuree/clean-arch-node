import pino from 'pino';

const transport = pino.transport({
  target: 'pino-pretty',
  options: { destination: 1 }, // ใช้ stdout
});

export const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
  },
  transport,
);

// เพิ่มฟังก์ชันสำหรับ cleanup
export async function closeLogger() {
  await new Promise<void>((resolve) => {
    transport.on('close', resolve);
    transport.end();
  });
}
