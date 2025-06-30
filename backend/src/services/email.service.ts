// import nodemailer from 'nodemailer';
// import { createTestAccount } from 'nodemailer';
// import { sendMail } from '../utils/mailer'; // 이메일 초대

// /**
//  * 테스트용 가짜 메일 보내기
//  * @param to 받는 사람 이메일
//  * @param token Verification Token(uuid)
//  */
// export const sendVerificationEmail = async (to: string, token: string) => {
//   // 1. Ethereal 테스트 계정 생성
//   const testAccount = await createTestAccount();

//   // 2. Nodemailer 전송기 생성
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     auth: {
//       user: testAccount.user,
//       pass: testAccount.pass,
//     },
//   });

//   // 3. 인증 링크 생성
//   const verifyUrl = `http://localhost:5173/api/auth/verify?token=${token}`;

//   // 4. 메일 전송
//   const info = await transporter.sendMail({
//     from: '"TeamFlow" <no-reply@teamflow.com>',
//     to,
//     subject: 'TeamFlow 이메일 인증 (테스트)',
//     html: `<p>아래 링크를 클릭하여 이메일을 인증하세요:</p><a href="${verifyUrl}">${verifyUrl}</a>`,
//   });

//   // 5. 메일 확인용 URL 출력
//   console.log('📧 테스트 이메일 전송 완료');
//   console.log('🔗 메일 확인:', nodemailer.getTestMessageUrl(info));
// };

// //이메일 초대
// export const sendInvitationEmail = async (
//   fromName: string,
//   fromEmail: string,
//   toEmail: string,
//   token: string
// ) => {
//   await sendMail(fromName, fromEmail, toEmail, token);
// };

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

// services/email.service.ts
import { sendMail } from '../utils/mailer';
import { createVerifyToken } from '../utils/jwt';

export async function sendVerificationEmail(userEmail: string, userId: string) {
  const token = createVerifyToken(userId);

  const verifyLink = `http://localhost:5173/verify?token=${token}`;
  const html = `<p>이메일 인증을 완료하려면 아래 링크를 클릭해주세요:</p>
                <a href="${verifyLink}">이메일 인증</a>`;

  return sendMail({
    to: userEmail,
    subject: 'TeamFlow 이메일 인증',
    html,
  });
}


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