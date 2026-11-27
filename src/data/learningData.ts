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
  readonly certification?: {
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
      { label: "AWS DVA-C03 exam guide", href: "https://docs.aws.amazon.com/aws-certification/latest/developer-associate-03/" },
      { label: "AWS Developer Associate exam transition", href: "https://aws.amazon.com/blogs/training-and-certification/september-2026-new-offerings/" },
      { label: "Deploy a sample application with AWS SAM", href: "https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-getting-started-hello-world.html" },
    ],
  },
] as const satisfies readonly LearningModule[];

export const csModules = [
  {
    id: "cs-programming",
    title: "Programming & algorithms",
    summary: "Use one language consistently while you build problem-solving skills you can transfer to other languages.",
    outcome: "A tested command-line program and short notes explaining your algorithm and data structure choices.",
    tasks: [
      {
        id: "cs-programming-language",
        label: "Choose Python or TypeScript and write a CLI that parses a real dataset, summarizes it, and handles invalid input.",
      },
      {
        id: "cs-programming-structures",
        label: "Solve exercises with arrays, hash maps, stacks, queues, trees, and graphs. Explain when each structure fits.",
      },
      {
        id: "cs-programming-complexity",
        label: "Implement binary search and one graph traversal. Explain their time and space complexity and compare with a simpler approach.",
      },
      {
        id: "cs-programming-testing",
        label: "Test normal, empty, and malformed inputs and document how to run the program from a fresh checkout.",
      },
    ],
    resources: [
      { label: "Harvard CS50x", href: "https://cs50.harvard.edu/x/" },
      { label: "MIT Introduction to Algorithms", href: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/" },
    ],
  },
  {
    id: "cs-systems",
    title: "Systems & networking",
    summary: "Understand how Linux runs your code and how a request reaches a service, including when it fails.",
    outcome: "A short troubleshooting notebook with a network diagram and examples you can reproduce locally.",
    tasks: [
      {
        id: "cs-systems-linux",
        label: "Practice shell pipelines, files, and permissions. Inspect your own processes and identify how they use CPU and memory.",
      },
      {
        id: "cs-systems-concurrency",
        label: "Read about processes, threads, and virtual memory, then write a small parallel program and compare it with a sequential version.",
      },
      {
        id: "cs-systems-requests",
        label: "Diagram a request through DNS, TCP, TLS, and HTTP. Inspect headers and status codes from a service you run locally.",
      },
      {
        id: "cs-systems-debug",
        label: "Simulate a service outage or bad port in your local setup. Use service logs and socket state to isolate the cause.",
      },
    ],
    resources: [
      { label: "Operating Systems: Three Easy Pieces", href: "https://pages.cs.wisc.edu/~remzi/OSTEP/" },
      { label: "MDN overview of HTTP", href: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview" },
      { label: "The Missing Semester of Your CS Education", href: "https://missing.csail.mit.edu/" },
    ],
  },
  {
    id: "cs-backend",
    title: "SQL & backend",
    summary: "Make application data reliable and expose it through a well-documented API.",
    outcome: "A backend service with migrations, a seeded PostgreSQL database, and an API contract.",
    tasks: [
      {
        id: "cs-backend-schema",
        label: "Model a real workflow in PostgreSQL. Add keys, constraints, and migrations, then seed the database with sample data.",
      },
      {
        id: "cs-backend-query",
        label: "Practice joins and transactions. Use EXPLAIN to compare a representative query before and after adding an index.",
      },
      {
        id: "cs-backend-api",
        label: "Build a small HTTP API with input validation, parameterized SQL, and predictable error responses.",
      },
      {
        id: "cs-backend-contract",
        label: "Describe the API with OpenAPI and test valid requests, invalid inputs, and an unsuccessful write.",
      },
    ],
    resources: [
      { label: "PostgreSQL tutorial", href: "https://www.postgresql.org/docs/current/tutorial.html" },
      { label: "OpenAPI specification", href: "https://spec.openapis.org/oas/latest.html" },
    ],
  },
  {
    id: "cs-engineering-workflow",
    title: "Engineering workflow",
    summary: "Practice the habits that make software easier for someone else to run, review, and maintain.",
    outcome: "A project with a reviewed pull request, automated checks, and reproducible local setup.",
    tasks: [
      {
        id: "cs-engineering-workflow-git",
        label: "Make a focused Git branch, write clear commits, and ask a peer to review a pull request.",
      },
      {
        id: "cs-engineering-workflow-tests",
        label: "Add unit tests for core logic and integration tests for the API or database boundary.",
      },
      {
        id: "cs-engineering-workflow-ci",
        label: "Run lint, tests, and build in GitHub Actions on pull requests. Check that a failing test blocks a green run.",
      },
      {
        id: "cs-engineering-workflow-reproduce",
        label: "Document setup and verify a clean checkout. If you use containers, run the app and its dependencies with Docker Compose.",
      },
    ],
    resources: [
      { label: "Pro Git", href: "https://git-scm.com/book/en/v2" },
      { label: "GitHub Actions quickstart", href: "https://docs.github.com/en/actions/get-started/quickstart" },
    ],
  },
  {
    id: "cs-portfolio",
    title: "Portfolio & internship prep",
    summary: "Turn coursework and infrastructure labs into work you can show and explain in an internship interview.",
    outcome: "Two portfolio projects, a tailored résumé, and an application tracker.",
    tasks: [
      {
        id: "cs-portfolio-projects",
        label: "Publish a backend project and one systems or cloud project. Include a demo or screenshots and reproducible setup.",
      },
      {
        id: "cs-portfolio-case-study",
        label: "Write a short case study for each project explaining the problem, a design trade-off, and how you validated the result.",
      },
      {
        id: "cs-portfolio-resume",
        label: "Pin the project repositories, link them from your résumé, and ask your campus career service or a peer for feedback.",
      },
      {
        id: "cs-portfolio-apply",
        label: "Track internship deadlines, tailor your applications, and practice explaining a project and its trade-offs aloud.",
      },
    ],
    resources: [
      { label: "MIT career handbook", href: "https://capd.mit.edu/resources/career-handbook/" },
      { label: "MIT portfolio guidance", href: "https://capd.mit.edu/channels/portfolios/" },
      { label: "Customize your GitHub profile", href: "https://docs.github.com/en/account-and-profile/how-tos/profile-customization/managing-your-profile-readme" },
    ],
  },
] as const satisfies readonly LearningModule[];

export type LearningTaskId = (typeof awsModules | typeof csModules)[number]["tasks"][number]["id"];
