// services/email.service.ts
import { sendMail } from '../utils/mailer';
// import { createVerifyToken } from '../utils/jwt';

// export async function sendVerificationEmail(userEmail: string, userId: string) {
//   const token = createVerifyToken(userId);

//   const verifyLink = `http://localhost:5173/verify?token=${token}`;
//   const html = `<p>이메일 인증을 완료하려면 아래 링크를 클릭해주세요:</p>
//                 <a href="${verifyLink}">이메일 인증</a>`;

//   return sendMail({
//     to: userEmail,
//     subject: 'TeamFlow 이메일 인증',
//     html,
//   });
// }

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