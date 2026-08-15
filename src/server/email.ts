export type EmailMessage = { to: string; subject: string; html: string; text: string };
export interface EmailProvider { send(message: EmailMessage): Promise<void>; }

class ConsoleEmailProvider implements EmailProvider {
  async send(message: EmailMessage) {
    console.info(JSON.stringify({ event: 'email.sent', provider: 'console', to: message.to, subject: message.subject }));
  }
}

class ResendEmailProvider implements EmailProvider {
  async send(message: EmailMessage) {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;
    if (!apiKey || !from) throw new Error('RESEND_API_KEY and EMAIL_FROM are required.');
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [message.to], subject: message.subject, html: message.html, text: message.text }),
    });
    if (!response.ok) throw new Error(`Email provider returned HTTP ${response.status}.`);
  }
}

export function createEmailProvider(): EmailProvider {
  const provider = (process.env.EMAIL_PROVIDER ?? 'console').toLowerCase();
  if (provider === 'console' || provider === 'development') return new ConsoleEmailProvider();
  if (provider === 'resend') return new ResendEmailProvider();
  throw new Error(`Unsupported email provider: ${provider}`);
}

export function accountInvitationEmail(input: { name?: string | null; activationUrl: string }) {
  const greeting = input.name?.trim() || 'bạn';
  return {
    subject: 'Lời mời kích hoạt tài khoản',
    html: `<p>Chào ${escapeHtml(greeting)},</p><p>Tài khoản của bạn đã được tạo. Nhấn vào nút bên dưới để đặt mật khẩu và kích hoạt tài khoản.</p><p><a href="${escapeHtml(input.activationUrl)}">Kích hoạt tài khoản</a></p><p>Liên kết sẽ hết hạn theo thời gian được hiển thị trong hệ thống.</p>`,
    text: `Chào ${greeting},\n\nKích hoạt tài khoản: ${input.activationUrl}`,
  };
}

export function passwordResetEmail(input: { name?: string | null; resetUrl: string }) {
  const greeting = input.name?.trim() || 'bạn';
  return {
    subject: 'Đặt lại mật khẩu',
    html: `<p>Chào ${escapeHtml(greeting)},</p><p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p><p><a href="${escapeHtml(input.resetUrl)}">Đặt lại mật khẩu</a></p>`,
    text: `Chào ${greeting},\n\nĐặt lại mật khẩu: ${input.resetUrl}`,
  };
}

function escapeHtml(value: string) { return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;'); }
