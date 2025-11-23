import nodemailer from 'nodemailer';

// Configure email transporter
// For production, use proper SMTP credentials
// For development/testing, you can use Gmail with App Password or services like SendGrid, Mailgun
const createTransporter = () => {
  // Check if email service is configured
  const emailService = process.env.EMAIL_SERVICE || 'gmail';
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;

  if (!emailUser || !emailPassword) {
    console.warn('⚠️ Email service not configured. Password setup emails will not be sent.');
    console.warn('⚠️ Add EMAIL_USER, EMAIL_PASSWORD, and optionally EMAIL_SERVICE to .env file');
    return null;
  }

  // Support both service-based (Gmail) and SMTP-based (SendGrid, Mailgun, etc.)
  if (emailService === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });
  } else {
    // For SMTP (SendGrid, Mailgun, custom SMTP)
    const emailHost = process.env.EMAIL_HOST || 'smtp.gmail.com';
    const emailPort = process.env.EMAIL_PORT || 587;
    
    return nodemailer.createTransport({
      host: emailHost,
      port: emailPort,
      secure: emailPort === 465, // true for 465, false for other ports
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });
  }
};

export const sendPasswordResetEmail = async (email, token, name) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    // If email is not configured, log the link (for development)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    const resetLink = `${frontendUrl}/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
    console.log('\n📧 Email service not configured. Password reset link (for development):');
    console.log(resetLink);
    console.log('\n');
    return { sent: false, link: resetLink };
  }

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
  const resetLink = `${frontendUrl}/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
  const emailFrom = process.env.EMAIL_USER;

  const mailOptions = {
    from: `"Good Moments" <${emailFrom}>`,
    to: email,
    subject: 'Reset Your Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Reset Your Password</h2>
        <p>Hello ${name || 'User'},</p>
        <p>You requested to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="background-color: #1976d2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; word-break: break-all;">${resetLink}</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          This link will expire in 1 hour. If you didn't request this, please ignore this email.
        </p>
        <p style="color: #999; font-size: 12px;">
          If you didn't request a password reset, your account is still secure. You can safely ignore this email.
        </p>
      </div>
    `,
    text: `
      Reset Your Password
      
      Hello ${name || 'User'},
      
      You requested to reset your password. Click this link to create a new password: ${resetLink}
      
      This link will expire in 1 hour. If you didn't request this, please ignore this email.
      
      If you didn't request a password reset, your account is still secure. You can safely ignore this email.
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent successfully:', info.messageId);
    return { sent: true, link: resetLink };
  } catch (error) {
    console.error('❌ Error sending password reset email:', error.message);
    if (error.response) {
      console.error('SMTP Response:', error.response);
    }
    // Still return link for development
    return { sent: false, link: resetLink, error: error.message };
  }
};

export const sendPasswordSetupEmail = async (email, token, name) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    // If email is not configured, log the link (for development)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    const resetLink = `${frontendUrl}/auth/set-password?token=${token}&email=${encodeURIComponent(email)}`;
    console.log('\n📧 Email service not configured. Password setup link (for development):');
    console.log(resetLink);
    console.log('\n');
    return { sent: false, link: resetLink };
  }

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
  const resetLink = `${frontendUrl}/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
  const emailFrom = process.env.EMAIL_USER;

  const mailOptions = {
    from: `"Good Moments" <${emailFrom}>`,
    to: email,
    subject: 'Set Password for Your Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Set Password for Your Account</h2>
        <p>Hello ${name || 'User'},</p>
        <p>You requested to set a password for your account. This will allow you to sign in with your email address.</p>
        <p>Click the button below to set your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="background-color: #1976d2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Set Password
          </a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; word-break: break-all;">${resetLink}</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          This link will expire in 1 hour. If you didn't request this, please ignore this email.
        </p>
        <p style="color: #999; font-size: 12px;">
          Note: If you prefer to continue using Google Sign In, you can ignore this email.
        </p>
      </div>
    `,
    text: `
      Set Password for Your Account
      
      Hello ${name || 'User'},
      
      You requested to set a password for your account. This will allow you to sign in with your email address.
      
      Click this link to set your password: ${resetLink}
      
      This link will expire in 1 hour. If you didn't request this, please ignore this email.
      
      Note: If you prefer to continue using Google Sign In, you can ignore this email.
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password setup email sent successfully:', info.messageId);
    return { sent: true, link: resetLink };
  } catch (error) {
    console.error('❌ Error sending password setup email:', error.message);
    if (error.response) {
      console.error('SMTP Response:', error.response);
    }
    // Still return link for development
    return { sent: false, link: resetLink, error: error.message };
  }
};

