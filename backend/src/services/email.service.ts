import nodemailer from 'nodemailer';
import { createTestAccount } from 'nodemailer';

/**
 * 테스트용 가짜 메일 보내기
 * @param to 받는 사람 이메일
 * @param token Verification Token(uuid)
 */
export const sendVerificationEmail = async (to: string, token: string) => {
  // 1. Ethereal 테스트 계정 생성
  const testAccount = await createTestAccount();

  // 2. Nodemailer 전송기 생성
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  // 3. 인증 링크 생성
  const verifyUrl = `http://localhost:5173/api/auth/verify?token=${token}`;

  // 4. 메일 전송
  const info = await transporter.sendMail({
    from: '"TeamFlow" <no-reply@teamflow.com>',
    to,
    subject: 'TeamFlow 이메일 인증 (테스트)',
    html: `<p>아래 링크를 클릭하여 이메일을 인증하세요:</p><a href="${verifyUrl}">${verifyUrl}</a>`,
  });

  // 5. 메일 확인용 URL 출력
  console.log('📧 테스트 이메일 전송 완료');
  console.log('🔗 메일 확인:', nodemailer.getTestMessageUrl(info));
};

/*
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const verifyUrl = `http://localhost:5173/verify?token=${token}`;
  await transporter.sendMail({
    from: '"TeamFlow" <no-reply@teamflow.com>',
    to: email,
    subject: 'TeamFlow 이메일 인증',
    html: `<p>이메일 인증을 위해 아래 링크를 클릭하세요:</p><a href="${verifyUrl}">${verifyUrl}</a>`,
  });
};
*/
