import { sendMail } from '../utils/mailer';

/**
 * 로그인 인증 메일 보내기
 * @param to 받는 사람 이메일
 * @param token Verification Token(uuid)
 */
export const sendVerificationEmail = async (email: string, token: string) => {
  const verifyUrl = `http://localhost:5173/verify?token=${token}`;
  await sendMail({
    to: email,
    subject: 'TeamFlow 이메일 인증',
    html: `<p>이메일 인증을 위해 아래 링크를 클릭하세요:</p><a href="${verifyUrl}">${verifyUrl}</a>`,
  });
};

/**
 * 비밀번호 재설정 메일 보내기
 * @param email
 * @param token
 */
export const sendResetEmail = async (email: string, token: string) => {
  const resetUrl = `http://localhost:5173/reset-password?token=${token}`;

  await sendMail({
    to: email,
    subject: 'TeamFlow 비밀번호 재설정',
    html: `<p>아래 링크를 클릭하여 비밀번호를 재설정하세요:</p><a href="${resetUrl}">${resetUrl}</a>`,
  });
};
