import { sendMail } from '../utils/mailer';
import { getEmailTemplate } from '../utils/mailTemplate';

/**
 * 로그인 인증 메일 보내기
 * @param to 받는 사람 이메일
 * @param token Verification Token(uuid)
 */
export const sendVerificationEmail = async (email: string, token: string) => {
  const verifyUrl = `http://localhost:5173/verify?token=${token}`;
  const html = getEmailTemplate({
    title: 'TeamFlow 이메일 인증',
    description: '이메일 인증을 위해 아래 버튼을 클릭하세요',
    buttonUrl: verifyUrl,
    buttonText: '인증하기',
  });
  await sendMail({
    to: email,
    subject: 'TeamFlow 이메일 인증',
    html,
  });
};

/**
 * 비밀번호 재설정 메일 보내기
 * @param email 수신할 이메일
 * @param token 재설정 토큰
 */
export const sendResetEmail = async (email: string, token: string) => {
  const resetUrl = `http://localhost:5173/reset-password?token=${token}`;
  const html = getEmailTemplate({
    title: 'TeamFlow 비밀번호 재설정',
    description: '비밀번호 재설정을 위해 아래 버튼을 클릭하세요',
    buttonUrl: resetUrl,
    buttonText: '비밀번호 재설정',
  });
  await sendMail({
    to: email,
    subject: 'TeamFlow 비밀번호 재설정',
    html,
  });
};

/** 초대 이메일 */ 
export async function sendInvitationEmail({
  fromName,
  fromEmail,
  toEmail,
  token,
}: {
  fromName: string;
  fromEmail: string;
  toEmail: string;
  token: string;
}) {
  const invitationLink = `http://localhost:5173/invite?token=${token}`;
  const html = `
    <p>안녕하세요,</p>
    <p><strong>${fromName} </strong> (${fromEmail}) 님이 당신을 워크스페이스에 초대했습니다.</p>
    <p>서비스에 참여하시려면 아래 버튼을 클릭하세요:</p> <p></p>
    <a href="${invitationLink}" style="padding: 10px 20px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 5px;">초대 수락하기</a>
  `;

  return sendMail({
    to: toEmail,
    subject: `💌 ${fromName} 님이 당신을 TeamFlow 워크스페이스에 초대했어요`,
    html,
  });
}
