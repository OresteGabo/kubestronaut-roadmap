export interface LearningModule {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly outcome: string;
  readonly tasks: readonly {
    readonly id: string;
    readonly label: string;
    readonly kind?: "exam-pass";
  }[];
  readonly resources: readonly {
    readonly label: string;
    readonly href: string;
  }[];
  readonly certification: {
    readonly code: string;
    readonly priority: "Recommended first" | "Optional foundation" | "Specialization";
    readonly versionNote?: string;
  };
}

// Keep module and task IDs stable so saved progress and backups remain usable.
export const awsModules = [
  {
    id: "aws-cloud-practitioner",
    title: "Cloud Practitioner",
    summary: "Learn AWS vocabulary and billing basics. Take the optional exam if you want a foundational credential.",
    outcome: "An AWS service map and a checklist for safely starting and cleaning up each lab.",
    certification: { code: "CLF-C02", priority: "Optional foundation" },
    tasks: [
      {
        id: "aws-cloud-practitioner-skill-builder",
        label: "Complete AWS Cloud Practitioner Essentials and explain Regions, Availability Zones, and shared responsibility.",
      },
      {
        id: "aws-cloud-practitioner-iam",
        label: "Practice least-privilege IAM permissions in a training sandbox and explain when to use an IAM role.",
      },
      {
        id: "aws-cloud-practitioner-s3",
        label: "Complete an AWS Educate storage lab and keep static files in a private S3 bucket.",
      },
      {
        id: "aws-cloud-practitioner-cost-controls",
        label: "Configure a budget alert before using your own account, and verify that lab resources are removed afterward.",
      },
      {
        id: "aws-cloud-practitioner-pass",
        label: "If you choose the credential, review the exam guide and pass CLF-C02.",
        kind: "exam-pass",
      },
    ],
    resources: [
      { label: "AWS Cloud Practitioner certification and exam prep", href: "https://aws.amazon.com/certification/certified-cloud-practitioner/" },
      { label: "AWS CLF-C02 exam guide", href: "https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/" },
      { label: "AWS Cloud Essentials courses", href: "https://aws.amazon.com/getting-started/cloud-essentials/" },
      { label: "AWS Educate labs", href: "https://aws.amazon.com/education/awseducate/" },
      { label: "Create an AWS budget", href: "https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-create.html" },
    ],
  },
  {
    id: "aws-solutions-architect",
    title: "Solutions Architect – Associate",
    summary: "Start here for a technical AWS certification. Use your Kubernetes experience to compare managed compute, networking, storage, and databases.",
    outcome: "An architecture diagram, a small working lab, and a written explanation of cost and reliability trade-offs.",
    certification: { code: "SAA-C03", priority: "Recommended first" },
    tasks: [
      {
        id: "aws-solutions-architect-vpc",
        label: "Build a VPC lab with public and private subnets, routing, and security groups. Verify which connections are allowed.",
      },
      {
        id: "aws-solutions-architect-three-tier",
        label: "Diagram a multi-AZ service using EC2, a load balancer, RDS, and S3. Deploy a small part of it in a sandbox.",
      },
      {
        id: "aws-solutions-architect-design-review",
        label: "Compare RDS and DynamoDB for one use case, and document the security, recovery, performance, and cost trade-offs.",
      },
      {
        id: "aws-solutions-architect-exam-prep",
        label: "Work through the official practice questions and repeat a lab for your weakest domain.",
      },
      {
        id: "aws-solutions-architect-pass",
        label: "Schedule and pass SAA-C03 when you can explain your design decisions without notes.",
        kind: "exam-pass",
      },
    ],
    resources: [
      { label: "AWS SAA-C03 exam guide", href: "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03.html" },
      { label: "AWS Solutions Architect certification and exam prep", href: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" },
      { label: "AWS Well-Architected Framework", href: "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html" },
    ],
  },
  {
    id: "aws-cloudops",
    title: "CloudOps Engineer – Associate",
    summary: "Choose this specialization for platform engineering, cloud operations, or SRE. An ECR and EKS lab is an optional bridge from Kubernetes.",
    outcome: "A repeatable deployment, a monitoring dashboard, and a recovery runbook you have tested.",
    certification: { code: "SOA-C03", priority: "Specialization" },
    tasks: [
      {
        id: "aws-cloudops-infrastructure",
        label: "Provision a small workload with CloudFormation or AWS CDK and verify that you can recreate and tear it down.",
      },
      {
        id: "aws-cloudops-observability",
        label: "Create a CloudWatch dashboard and an alarm for a failure you can reproduce safely in the lab.",
      },
      {
        id: "aws-cloudops-recovery",
        label: "Restore one lab resource from a backup and record your actual recovery time and data loss.",
      },
      {
        id: "aws-cloudops-incident",
        label: "Troubleshoot a lab connectivity or permissions issue and write a runbook using logs and metrics as evidence.",
      },
      {
        id: "aws-cloudops-pass",
        label: "If you choose the operations path, use the exam guide to review gaps and pass SOA-C03.",
        kind: "exam-pass",
      },
    ],
    resources: [
      { label: "AWS CloudOps Engineer certification and exam prep", href: "https://aws.amazon.com/certification/certified-cloudops-engineer-associate/" },
      { label: "AWS SOA-C03 exam guide", href: "https://docs.aws.amazon.com/aws-certification/latest/sysops-administrator-associate-03/" },
      { label: "CloudWatch dashboard quickstart", href: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/GettingStarted.html" },
      { label: "Optional lab: Use ECR images with EKS", href: "https://docs.aws.amazon.com/AmazonECR/latest/userguide/ECR_on_EKS.html" },
    ],
  },
  {
    id: "aws-developer",
    title: "Developer – Associate",
    summary: "Choose this specialization for building and maintaining AWS applications, especially backend or serverless services.",
    outcome: "A small serverless API with tested deployments, least-privilege access, and useful logs.",
    certification: {
      code: "DVA-C03",
      priority: "Specialization",
      versionNote: "DVA-C02 ends November 30, 2026. DVA-C03 exam delivery begins December 1, 2026.",
    },
    tasks: [
      {
        id: "aws-developer-serverless",
        label: "Build an API Gateway and Lambda endpoint backed by DynamoDB. Use a purpose-built IAM role for runtime permissions.",
      },
      {
        id: "aws-developer-deploy",
        label: "Package the API with AWS SAM, add automated tests, and use CI/CD to deploy to a test environment.",
      },
      {
        id: "aws-developer-debug",
        label: "Use CloudWatch logs and metrics to diagnose a lab error. Add a regression test for the fix.",
      },
      {
        id: "aws-developer-exam-prep",
        label: "Use the DVA-C03 guide and practice questions to review gaps, including how to review and test an AI-assisted code change.",
      },
      {
        id: "aws-developer-pass",
        label: "If you choose the application development path, schedule and pass DVA-C03.",
        kind: "exam-pass",
      },
    ],
    resources: [
      { label: "AWS Developer certification and exam prep", href: "https://aws.amazon.com/certification/certified-developer-associate/" },
      { label: "AWS DVA-C03 exam guide", href: "https://docs.aws.amazon.com/aws-certification/latest/developer-associate-03/" },
      { label: "AWS Developer Associate exam transition", href: "https://aws.amazon.com/blogs/training-and-certification/september-2026-new-offerings/" },
      { label: "Deploy a sample application with AWS SAM", href: "https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-getting-started-hello-world.html" },
    ],
  },
] as const satisfies readonly LearningModule[];

export type LearningTaskId = (typeof awsModules)[number]["tasks"][number]["id"];
