import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendAnnouncementEmail = async (to: string, subject: string, title: string, content: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `AcadeMetrics: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
        <h2>${title}</h2>
        <p>${content}</p>
        <hr />
        <p style="font-size: 0.8em; color: #555;">Sent via AcadeMetrics Platform</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('[Email-Service] Announcement Sent:', info.messageId);
    return info;
  } catch (error: any) {
    console.error('[Email-Service] Send Error:', error.message);
    throw error;
  }
};

export const sendExamNotification = async (to: string, examTitle: string, dueDate: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `AcadeMetrics: New Exam Posted - ${examTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
        <h2>New Exam: ${examTitle}</h2>
        <p>A new exam has been posted for your course.</p>
        <p><strong>Due Date:</strong> ${dueDate}</p>
        <hr />
        <p style="font-size: 0.8em; color: #555;">AcadeMetrics Platform</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('[Email-Service] Exam Notification Sent:', info.messageId);
    return info;
  } catch (error: any) {
    console.error('[Email-Service] Send Error:', error.message);
    throw error;
  }
};
