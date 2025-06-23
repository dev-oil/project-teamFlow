import nodemailer from 'nodemailer';

// export const sendInvitationEmail = async (to: string, token: string) => {

export const sendInvitationEmail = async (
  fromEmail: string,
  toEmail: string,
  message: string
) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // const info = await transporter.sendMail({
  //   from: '"TeamFlow 초대" <your-email@gmail.com>',
  //   to,
  //   subject: '워크스페이스 초대 링크',
  //   html: `
  //     <p>안녕하세요!</p>
  //     <p>다음 링크를 클릭하여 워크스페이스에 가입하세요:</p>
  //     <a href="https://your-app.com/invite/${token}">초대 링크</a>
  //     <p>3일 내에 만료됩니다.</p>
  //   `,
  // });

  await transporter.sendMail({
    from: `"${fromEmail}" Teamflow`, // 표시되는 보낸 사람 이름
    to: toEmail,
    subject: `💌 ${fromEmail} 님이 당신을 초대했어요`,
    html: `
      <p>안녕하세요,</p>
      <p><strong>${fromEmail}</strong> 님이 당신에게 다음 메시지를 보냈습니다:</p>
      <blockquote>${message}</blockquote>
      <p>서비스에 참여하시려면 아래 링크를 클릭하세요:</p>
      <a href="https://your-service.com/invite">초대 수락하기</a>
    `,
  });

  console.log(`✅ ${fromEmail} → ${toEmail} 로 이메일 발송됨`);
};
