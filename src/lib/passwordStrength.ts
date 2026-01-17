export const checkPasswordStrength = (password: string) => {
  let score = 0;
  const feedback: string[] = [];

  // If the password is empty, return a default weak state
  if (password.length === 0) {
    return {
      score: 0,
      status: '',
      color: '#ddd',
      feedback: []
    };
  }

  // Define criteria for scoring
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~` ]/.test(password);

  // Length checks contribute the most to the score
  if (password.length >= 8) {
    score += 20;
  } else {
    feedback.push('at least 8 characters');
  }
  if (password.length >= 12) {
    score += 20;
  }
  if (password.length >= 15) {
    score += 20;
  }

  // Character type checks
  if (hasLowerCase) score += 10; else feedback.push('a lowercase letter');
  if (hasUpperCase) score += 10; else feedback.push('an uppercase letter');
  if (hasNumbers) score += 10; else feedback.push('a number');
  if (hasSpecialChars) score += 10; else feedback.push('a special character');

  // Clamp score to 100
  if (score > 100) score = 100;

  // Determine the status and color based on the final score
  let status = '';
  let color = '';

  if (score < 50) {
    status = 'Weak';
    color = '#ef4444'; // Tailwind red-500
  } else if (score < 75) {
    status = 'Medium';
    color = '#facc15'; // Tailwind yellow-400
  } else if (score < 100) {
    status = 'Strong';
    color = '#22c55e'; // Tailwind green-500
  } else {
    status = 'Very Strong';
    color = '#3b82f6'; // Tailwind blue-500
  }

  return { score, status, color, feedback };
};
