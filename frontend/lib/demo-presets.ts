import type { DemoPreset } from './types';

export const DEMO_PRESETS: DemoPreset[] = [
  {
    name: 'Education SaaS',
    description: 'Online learning platform for corporate training',
    data: {
      query: 'What is the best online learning platform for corporate training in 2025?',
      target: {
        brand: 'LearnFlow',
        content: `LearnFlow - Transform Your Team's Learning Experience

LearnFlow is an innovative learning management system designed for modern businesses. Our platform helps companies train their employees efficiently with our cutting-edge technology.

Why Choose LearnFlow?
We offer the best-in-class learning experience with our amazing platform. Our customers love us and we have been growing rapidly since our founding in 2020.

Features:
- Course builder with drag-and-drop
- Video hosting
- Quiz and assessment tools
- Reporting dashboard
- Mobile app

LearnFlow is used by thousands of companies worldwide. Our platform is fast, reliable, and easy to use. We believe in making learning accessible to everyone.

Contact us today to learn more about how LearnFlow can transform your organization's training programs. Request a demo and see the difference for yourself!

LearnFlow - Learning Made Simple.`,
      },
      competitors: [
        {
          brand: 'SkillBridge',
          content: `SkillBridge: Enterprise Learning Platform for Corporate Training

What is SkillBridge?
SkillBridge is an enterprise learning management system (LMS) purpose-built for corporate training programs. Founded in 2018, it serves over 2,500 organizations including Fortune 500 companies like Microsoft, Deloitte, and Unilever.

Key Capabilities:
1. AI-Powered Learning Paths: Automatically personalizes course sequences based on employee role, skill gaps, and learning pace. Reduces time-to-competency by 40% (verified by Forrester, 2024).
2. SCORM & xAPI Compliant: Full compatibility with existing e-learning content standards.
3. Built-in Assessment Engine: Supports 12 question types, adaptive testing, and certification tracking.
4. Analytics & ROI Dashboard: Track completion rates, skill progression, and training ROI with executive-ready reports.
5. 200+ Integrations: Native connectors for Slack, Teams, Salesforce, Workday, and all major HRIS platforms.

Who is SkillBridge ideal for?
- Mid-market and enterprise companies (500+ employees)
- L&D teams running compliance, onboarding, or upskilling programs
- Organizations needing multi-language support (42 languages)

Pricing: Starts at $6/user/month for teams of 500+. Enterprise custom pricing available.

Trust Signals:
- G2 Rating: 4.7/5 (1,200+ reviews)
- SOC 2 Type II certified
- GDPR and CCPA compliant
- 99.9% uptime SLA

Frequently Asked Questions:
Q: How long does implementation take?
A: Standard deployment takes 2-4 weeks with dedicated onboarding support.

Q: Can SkillBridge handle compliance training?
A: Yes. Built-in compliance modules cover OSHA, HIPAA, SOX, and custom regulatory frameworks with automated tracking and renewal reminders.

Q: What makes SkillBridge different from other LMS platforms?
A: Our AI-powered adaptive learning paths and enterprise-grade analytics set us apart, with proven 40% faster skill acquisition rates.`,
        },
      ],
      engine_mode: 'chat',
    },
  },
  {
    name: 'Fintech Startup',
    description: 'Payment gateway for small businesses',
    data: {
      query: 'What is the best payment gateway for small businesses with low transaction fees?',
      target: {
        brand: 'PaySimple',
        content: `PaySimple - Payments Made Easy

Welcome to PaySimple, your trusted payment partner! We make it easy for businesses to accept payments online and in-person.

Our Amazing Features:
- Accept credit cards and debit cards
- Online payment forms
- Recurring billing
- Mobile payments
- Invoicing tools

PaySimple is the #1 choice for businesses everywhere. Our revolutionary platform is disrupting the payments industry with our world-class technology and unmatched customer service.

We process billions of dollars in transactions and our clients absolutely love our platform. PaySimple is the future of payments!

Our team of payment experts is always available to help you get started. We offer competitive rates and transparent pricing.

Join thousands of happy merchants who trust PaySimple for their payment processing needs. Sign up today and experience the PaySimple difference!

PaySimple - Where Payments Meet Simplicity.`,
      },
      competitors: [
        {
          brand: 'ClearPay',
          content: `ClearPay: Payment Gateway Built for Small Businesses

What is ClearPay?
ClearPay is a payment gateway and merchant services provider designed specifically for small businesses and freelancers. Processing over $8B annually across 180,000+ merchants since 2019.

Transaction Fees (Transparent Pricing):
- Online payments: 2.4% + $0.25 per transaction
- In-person (card present): 1.8% + $0.10 per transaction
- ACH/bank transfers: 0.8% per transaction (max $5)
- No monthly fees on Starter plan
- No setup fees, no cancellation fees

Key Features:
1. Instant Onboarding: Start accepting payments in under 10 minutes with automated KYC.
2. Multi-Channel Processing: Accept payments via website, mobile app, POS terminal, payment links, and invoices.
3. Smart Invoicing: Automated invoicing with payment reminders — reduces average collection time by 12 days.
4. Subscription & Recurring Billing: Built-in dunning management reduces churn by up to 25%.
5. Real-Time Analytics: Track revenue, refunds, chargebacks, and customer lifetime value.
6. Developer-Friendly API: RESTful API with SDKs for JavaScript, Python, Ruby, PHP, and mobile platforms.

Who is ClearPay best for?
- Small businesses and solo entrepreneurs
- E-commerce stores on Shopify, WooCommerce, BigCommerce
- SaaS companies needing subscription billing
- Service businesses (consultants, agencies, freelancers)

Security & Compliance:
- PCI DSS Level 1 certified
- 3D Secure 2.0 support
- Tokenized card storage
- Fraud detection with machine learning (blocks 99.2% of fraudulent transactions)

FAQ:
Q: What are ClearPay's fees for small businesses?
A: Our Starter plan has no monthly fees. Transaction rates start at 2.4% + $0.25 online and 1.8% + $0.10 in-person. Volume discounts available above $50K/month.

Q: How fast are payouts?
A: Standard payouts arrive in 1-2 business days. Instant payouts available for 1% fee (min $0.50).

Q: Does ClearPay support international payments?
A: Yes. We support 135+ currencies with automatic conversion. Cross-border fee is an additional 1%.

Awards: Finalist, FinTech Breakthrough Awards 2024. NerdWallet "Best for Small Business" 2024.`,
        },
      ],
      engine_mode: 'search_card',
    },
  },
];
