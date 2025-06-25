import nodemailer from 'nodemailer';

// export const sendInvitationEmail = async (to: string, token: string) => {

export const sendInvitationEmail = async (
  fromName : string,
  fromEmail: string,
  toEmail: string,
  token: string,
) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

 const invitationLink = `http://localhost:5173/invite/${token}`; // 또는 배포 주소

  await transporter.sendMail({
    from: `"${fromEmail}" Teamflow`, // 표시되는 보낸 사람 이름
    to: toEmail,
    subject: `💌 ${fromName} 님이 당신을 Teamflow 워크스페이스에 초대했어요`,
    html: `
      <p>안녕하세요,</p>
      <p><strong>${fromName}</strong>  님이 당신을 워크스페이스에 초대했습니다.</p>
      <p>서비스에 참여하시려면 아래 링크를 클릭하세요:</p>
      <a href="https://your-service.com/invite">초대 수락하기</a>

       <a href="${invitationLink}" style="padding: 10px 20px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 5px;">초대 수락하기</a>
    `,
  });

  console.log(`✅ ${fromEmail} → ${toEmail} 로 이메일 발송됨`);
};

//