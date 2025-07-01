import { EmailTemplateOptions } from '../types/templateOption';

/**
 *
 * @param title - 이메일 제목
 * @param description - 이메일 본문 설명
 * @param [buttonText] - 버튼에 표시될 텍스트 (선택)
 * @param [buttonUrl] - 버튼 클릭 시 이동할 URL (선택)
 * @returns 생성된 이메일 템플릿 HTML 문자열
 */
export const getEmailTemplate = ({
  title,
  description,
  buttonText,
  buttonUrl,
}: EmailTemplateOptions): string => {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #fafafa; padding: 40px; text-align: center;">
      <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 32px;">
        <h2 style="font-size: 20px; font-weight: bold; color: #0f172a; margin-top: 8px;">${title}</h2>
        <p style="color: #334155; font-size: 16px; margin-top: 16px;">${description}</p>

        ${
          buttonUrl && buttonText
            ? `<a href="${buttonUrl}" style="display: inline-block; margin-top: 24px; padding: 12px 24px; background-color: #171717; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
                ${buttonText}
              </a>`
            : ''
        }

        <hr style="margin-top: 32px; border-color: #e2e8f0;" />
        <p style="color: #94a3b8; font-size: 12px; margin-top: 16px;">
          이 메일은 TeamFlow 서비스 이용을 위한 자동 발송 메일입니다.
        </p>
      </div>
    </div>
  `;
};
