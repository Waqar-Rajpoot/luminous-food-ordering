import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Section,
  Text,
  Container,
  Hr,
  Link,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
  emailType: "VERIFY" | "RESET";
}

export default function VerificationEmail({ username, otp, emailType }: VerificationEmailProps) {
  const isVerify = emailType === "VERIFY";

  return (
    <Html>
      <Head>
        <title>{isVerify ? "Verify Your Account" : "Reset Your Password"}</title>
        <Font
          fontFamily="Helvetica"
          fallbackFontFamily="Arial"
          fontWeight="400"
          fontStyle="normal"
        />
      </Head>
      <Preview>{otp} is your security code</Preview>
      
      <Section style={main}>
        <Container style={container}>
          {/* Simple Brand Header */}
          <Section style={header}>
            <Text style={logoText}>
              LUMINOUS <span style={goldText}>FOOD</span>
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Main Body */}
          <Section style={content}>
            <Heading style={h1}>Hello {username},</Heading>
            
            <Text style={paragraph}>
              {isVerify 
                ? "Thank you for joining Luminous Food. To complete your registration and secure your account, please use the following verification code:" 
                : "A password reset was requested for your Luminous Food account. Use the code below to proceed with the reset."}
            </Text>

            {/* Clean OTP Display */}
            <Section style={otpBox}>
              <Text style={otpText}>{otp}</Text>
            </Section>

            <Text style={expiryText}>This code will expire in 5 minutes.</Text>

            <Text style={warningText}>
              If you didn&rsquo;t request this email, you can safely ignore it. Your account remains secure.
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Professional Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © 2026 Luminous Food Systems. All rights reserved.
            </Text>
            <Link href="https://luminous-food-ordering.vercel.app" style={footerLink}>
              luminous-food-ordering.vercel.app
            </Link>
          </Section>
        </Container>
      </Section>
    </Html>
  );
}

// --- Clean & Simple Styles ---

const main = {
  backgroundColor: "#f6f9fc",
  padding: "40px 0",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px",
  borderRadius: "8px",
  border: "1px solid #e6ebf1",
  maxWidth: "540px",
};

const header = {
  textAlign: "left" as const,
  paddingBottom: "10px",
};

const logoText = {
  color: "#1a1f36",
  fontSize: "20px",
  fontWeight: "700",
  letterSpacing: "1px",
  margin: "0",
};

const goldText = {
  color: "#EFA765", // Your brand color
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const content = {
  textAlign: "left" as const,
};

const h1 = {
  color: "#1a1f36",
  fontSize: "20px",
  fontWeight: "600",
  margin: "0 0 16px",
};

const paragraph = {
  color: "#4f566b",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 24px",
};

const otpBox = {
  backgroundColor: "#f9fafb",
  borderRadius: "4px",
  padding: "20px",
  textAlign: "center" as const,
  border: "1px solid #e6ebf1",
  margin: "24px 0",
};

const otpText = {
  color: "#1a1f36",
  fontSize: "32px",
  fontWeight: "700",
  letterSpacing: "6px",
  margin: "0",
};

const expiryText = {
  color: "#8792a2",
  fontSize: "14px",
  textAlign: "center" as const,
  margin: "10px 0 0",
};

const warningText = {
  color: "#8792a2",
  fontSize: "14px",
  lineHeight: "20px",
  marginTop: "32px",
};

const footer = {
  textAlign: "center" as const,
};

const footerText = {
  color: "#8792a2",
  fontSize: "12px",
  margin: "0",
};

const footerLink = {
  color: "#EFA765",
  fontSize: "12px",
  textDecoration: "underline",
  display: "block",
  marginTop: "8px",
};