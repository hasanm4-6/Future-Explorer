/**
 * Email service infrastructure for lifecycle automation
 * Replace with your preferred email provider (e.g., Resend, SendGrid, Postmark)
 */

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export interface EmailTemplate {
  welcome: (data: { parentName: string; childNames: string[] }) => EmailData;
  completeProfileReminder: (data: { parentName: string }) => EmailData;
  firstMissionReminder: (data: { parentName: string; childNames: string[] }) => EmailData;
  weeklySummary: (data: {
    parentName: string;
    childName: string;
    lessonsCompleted: number;
    achievements: string[];
    weeklyMinutes: number;
    currentMission: string;
  }) => EmailData;
}

export const emailTemplates: EmailTemplate = {
  welcome: ({ parentName, childNames }) => ({
    to: '', // Will be set dynamically
    subject: 'Welcome to FuturExplore! 🚀',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to FuturExplore</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to FuturExplore! 🚀</h1>
            <p>Your AI learning adventure begins now</p>
          </div>
          <div class="content">
            <p>Hi ${parentName},</p>
            <p>Thank you for joining FuturExplore! We're excited to help your children discover the amazing world of AI through fun, interactive missions.</p>
            ${childNames.length > 0 ? `
              <p>Your young explorers are ready:</p>
              <ul>
                ${childNames.map(name => `<li>${name}</li>`).join('')}
              </ul>
            ` : '<p>Get started by adding your child profiles to begin their AI adventure!</p>'}
            <p>What's next?</p>
            <ul>
              <li>✅ Set up your child profiles (if not done already)</li>
              <li>🎯 Start your first AI mission</li>
              <li>📊 Track progress in your parent dashboard</li>
            </ul>
            <a href="https://futurexplore.com/dashboard" class="button">Go to Dashboard</a>
            <p>All our missions are designed for children ages 6-13, with safety and privacy as our top priorities.</p>
            <p>Happy exploring!</p>
            <p>The FuturExplore Team</p>
          </div>
          <div class="footer">
            <p>© 2024 FuturExplore. Safe, ad-free learning for curious minds.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  completeProfileReminder: ({ parentName }) => ({
    to: '', // Will be set dynamically
    subject: 'Complete your child profiles to start the adventure! 🌟',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Complete Your Profile</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #f093fb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Almost there! 🌟</h1>
            <p>One more step to unlock the AI adventure</p>
          </div>
          <div class="content">
            <p>Hi ${parentName},</p>
            <p>We noticed you haven't completed your child profiles yet. Your young explorers are waiting to start their AI missions!</p>
            <p>Why complete the profiles?</p>
            <ul>
              <li>🎯 Personalized learning paths based on age and level</li>
              <li>🏆 Individual progress tracking and achievements</li>
              <li>🦊 Choose fun avatars for each child</li>
              <li>📊 Age-appropriate content delivery</li>
            </ul>
            <p>It only takes 2 minutes per child:</p>
            <ol>
              <li>Enter their name and age</li>
              <li>Select learning level</li>
              <li>Choose their favorite avatar</li>
            </ol>
            <a href="https://futurexplore.com/create-child" class="button">Complete Profiles Now</a>
            <p>Once set up, your children can immediately start their first AI mission and earn their first badge!</p>
            <p>Need help? Reply to this email and we'll assist you.</p>
            <p>The FuturExplore Team</p>
          </div>
          <div class="footer">
            <p>© 2024 FuturExplore. Building tomorrow's AI explorers, today.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  firstMissionReminder: ({ parentName, childNames }) => ({
    to: '', // Will be set dynamically
    subject: 'Ready for your first AI mission? 🚀',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Start Your First Mission</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #4facfe; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Adventure Awaits! 🚀</h1>
            <p>Your first AI mission is ready to begin</p>
          </div>
          <div class="content">
            <p>Hi ${parentName},</p>
            <p>Your young explorers are all set up and ready for their first AI mission! We haven't seen any lesson activity yet, and we're excited to get them started.</p>
            <p>First Mission: "What is AI?"</p>
            <ul>
              <li>⏱️ Only 5 minutes long</li>
              <li>📖 Fun story-based learning</li>
              <li>🎮 Interactive activities</li>
              <li>🏆 First badge waiting to be earned!</li>
            </ul>
            <p>In this mission, your child will:</p>
            <ul>
              <li>Meet Robi the friendly robot</li>
              <li>Learn what AI means in simple terms</li>
              <li>Complete a fun quiz</li>
              <li>Earn their "AI Curious" badge</li>
            </ul>
            <a href="https://futurexplore.com/dashboard" class="button">Start First Mission</a>
            <p>Remember, all missions are designed to be:</p>
            <ul>
              <li>✅ Age-appropriate and safe</li>
              <li>✅ Ad-free and focused</li>
              <li>✅ Just 5-7 minutes long</li>
              <li>✅ Fun and rewarding</li>
            </ul>
            <p>Ready to explore?</p>
            <p>The FuturExplore Team</p>
          </div>
          <div class="footer">
            <p>© 2024 FuturExplore. Making AI learning fun and safe.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  weeklySummary: ({ parentName, childName, lessonsCompleted, achievements, weeklyMinutes, currentMission }) => ({
    to: '', // Will be set dynamically
    subject: `Weekly Progress: ${childName}'s AI Adventure 📊`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Weekly Progress Summary</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .stats { display: flex; justify-content: space-around; margin: 20px 0; }
          .stat { text-align: center; padding: 15px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .stat-number { font-size: 24px; font-weight: bold; color: #667eea; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Weekly Progress Report 📊</h1>
            <p>${childName}'s AI Learning Journey</p>
          </div>
          <div class="content">
            <p>Hi ${parentName},</p>
            <p>Here's ${childName}'s weekly progress in their AI learning adventure!</p>
            
            <div class="stats">
              <div class="stat">
                <div class="stat-number">${weeklyMinutes}</div>
                <div>Minutes This Week</div>
              </div>
              <div class="stat">
                <div class="stat-number">${lessonsCompleted}</div>
                <div>Lessons Completed</div>
              </div>
              <div class="stat">
                <div class="stat-number">${achievements.length}</div>
                <div>New Badges</div>
              </div>
            </div>

            ${achievements.length > 0 ? `
              <h3>🏆 New Achievements</h3>
              <ul>
                ${achievements.map(badge => `<li>${badge}</li>`).join('')}
              </ul>
            ` : '<p>Keep going to earn more badges!</p>'}

            <h3>🎯 Current Mission</h3>
            <p><strong>${currentMission}</strong></p>
            <p>Ready to continue the adventure?</p>

            <h3>📈 Learning Insights</h3>
            <ul>
              <li>${weeklyMinutes >= 30 ? '✅ Great consistency! Keep up the regular practice.' : '💪 Try to aim for 30+ minutes per week for steady progress.'}</li>
              <li>${lessonsCompleted >= 2 ? '🚀 Excellent momentum! Your child is really engaged.' : '📚 Every lesson completed builds important AI foundations.'}</li>
              <li>${achievements.length > 0 ? '🌟 Fantastic achievement earning this week!' : '🎯 Next badge is just around the corner!'}</li>
            </ul>

            <a href="https://futurexplore.com/dashboard" class="button">View Full Dashboard</a>

            <h3>💡 Parent Tip</h3>
            <p>Ask your child about what they learned this week! Questions like "What did Robi the robot do today?" help reinforce learning and show your interest in their progress.</p>

            <p>Keep up the great work, ${parentName}! Your support makes all the difference in your child's learning journey.</p>
            <p>The FuturExplore Team</p>
          </div>
          <div class="footer">
            <p>© 2024 FuturExplore. Partnering with parents to raise AI-literate children.</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// Email service implementation - replace with your preferred provider
export const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    // Placeholder: Replace with your email service implementation
    // Examples:
    // - Resend: await resend.emails.send(emailData)
    // - SendGrid: await sgMail.send(emailData)
    // - Postmark: await postmark.sendEmail(emailData)
    
    if (import.meta.env.DEV) {
      console.log('[Email Service]', emailData);
      return true;
    }
    
    // Actual email service integration would go here
    return true;
  } catch (error) {
    console.error('Email send failed:', error);
    return false;
  }
};

export const emailService = {
  sendWelcome: async (parentEmail: string, parentName: string, childNames: string[]) => {
    const emailData = emailTemplates.welcome({ parentName, childNames });
    emailData.to = parentEmail;
    return await sendEmail(emailData);
  },

  sendCompleteProfileReminder: async (parentEmail: string, parentName: string) => {
    const emailData = emailTemplates.completeProfileReminder({ parentName });
    emailData.to = parentEmail;
    return await sendEmail(emailData);
  },

  sendFirstMissionReminder: async (parentEmail: string, parentName: string, childNames: string[]) => {
    const emailData = emailTemplates.firstMissionReminder({ parentName, childNames });
    emailData.to = parentEmail;
    return await sendEmail(emailData);
  },

  sendWeeklySummary: async (
    parentEmail: string,
    parentName: string,
    childName: string,
    lessonsCompleted: number,
    achievements: string[],
    weeklyMinutes: number,
    currentMission: string
  ) => {
    const emailData = emailTemplates.weeklySummary({
      parentName,
      childName,
      lessonsCompleted,
      achievements,
      weeklyMinutes,
      currentMission
    });
    emailData.to = parentEmail;
    return await sendEmail(emailData);
  }
};
