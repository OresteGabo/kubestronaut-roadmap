export type CertificationCode = "KCNA" | "CKA" | "CKAD" | "KCSA" | "CKS";
export type StageId = Lowercase<CertificationCode>;
export type ExamFormat = "multiple-choice" | "performance-based-cli";

type StudyRange = readonly [minimum: number, maximum: number];

interface ResourceLink {
  readonly label: string;
  readonly href: `https://${string}`;
}

interface ExamSimulator {
  readonly provider: "Killer.sh";
  readonly attempts: number;
  readonly hoursPerActivation: number;
  readonly excludedRegistration: `${CertificationCode}-SINGLE`;
}

interface ExamDetails {
  readonly format: ExamFormat;
  readonly delivery: "online-proctored";
  readonly durationMinutes: number;
  /** Null when the current official exam materials don't specify a fixed count. */
  readonly questionCount: number | null;
  readonly passingScorePercent: number;
  readonly simulator: ExamSimulator | null;
}

interface ExamPrerequisite {
  readonly certification: CertificationCode;
  readonly mustBeCurrent: boolean;
  readonly description: string;
}

export interface SyllabusDomain {
  readonly id: `${StageId}-domain-${string}`;
  readonly name: string;
  readonly weightPercent: number;
  readonly topics: readonly string[];
  readonly suggestedPractice?: readonly string[];
}

export interface ChecklistItem {
  readonly id: `${StageId}-step-${string}`;
  readonly kind: "preparation" | "exam-pass";
  readonly label: string;
  readonly detail?: string;
}

export interface RoadmapStage {
  readonly id: StageId;
  readonly code: CertificationCode;
  readonly name: string;
  readonly order: 1 | 2 | 3 | 4 | 5;
  readonly exam: ExamDetails;
  readonly study: {
    readonly weeks: StudyRange;
    readonly hours: StudyRange;
  };
  readonly suggestedPreparation: string;
  readonly formalPrerequisites: readonly ExamPrerequisite[];
  readonly domains: readonly SyllabusDomain[];
  readonly checklist: readonly ChecklistItem[];
  readonly resources: readonly ResourceLink[];
}

export const roadmapVerifiedOn = "2026-11-27";

const candidateHandbook = {
  label: "Linux Foundation Candidate Handbook",
  href: "https://docs.linuxfoundation.org/tc-docs/certification/lf-handbook2",
} as const satisfies ResourceLink;

const multipleChoiceExamGuide = {
  label: "Linux Foundation multiple-choice exam FAQ",
  href: "https://docs.linuxfoundation.org/tc-docs/certification/faq-mc",
} as const satisfies ResourceLink;

const handsOnExamGuide = {
  label: "Linux Foundation hands-on exam and simulator FAQ",
  href: "https://docs.linuxfoundation.org/tc-docs/certification/faq-cka-ckad-cks",
} as const satisfies ResourceLink;

const examEligibility = {
  label: "Linux Foundation exam eligibility FAQ",
  href: "https://training.linuxfoundation.org/about/faqs/certification-faq/",
} as const satisfies ResourceLink;

const careProgram = {
  label: "Linux Foundation CARE recertification policy",
  href: "https://training.linuxfoundation.org/care-program/",
} as const satisfies ResourceLink;

const multipleChoiceExam = {
  format: "multiple-choice",
  delivery: "online-proctored",
  durationMinutes: 90,
  questionCount: null,
  passingScorePercent: 75,
  simulator: null,
} as const satisfies ExamDetails;

const handsOnExam = {
  format: "performance-based-cli",
  delivery: "online-proctored",
  durationMinutes: 120,
  questionCount: null,
  passingScorePercent: 66,
} as const satisfies Omit<ExamDetails, "simulator">;

const killerSh = {
  provider: "Killer.sh",
  attempts: 2,
  hoursPerActivation: 36,
} as const satisfies Omit<ExamSimulator, "excludedRegistration">;

export const kubestronautProgram = {
  coreCertifications: ["KCNA", "CKA", "CKAD", "KCSA", "CKS"],
  additionalRequirement: {
    code: "CKNE",
    name: "Certified Kubernetes Network Engineer",
    effectiveOn: "2027-02-15",
    href: "https://www.cncf.io/training/certification/ckne/",
  },
  eligibility:
    "Hold all required certifications in active status at the same time. CNCF emails eligible candidates to complete onboarding and accept its Standards of Excellence before approval.",
  maintenance:
    "If a required certification expires after you earn the title, CNCF keeps your status through the end of that calendar year. Renew expired credentials by year-end to keep the title and benefits.",
  resources: [
    {
      label: "CNCF Kubestronaut program",
      href: "https://www.cncf.io/training/kubestronaut/",
    },
    {
      label: "CNCF Kubestronaut eligibility and renewal FAQ",
      href: "https://www.cncf.io/training/kubestronaut/kubestronaut-faq/",
    },
    careProgram,
  ],
} as const satisfies {
  readonly coreCertifications: readonly CertificationCode[];
  readonly additionalRequirement: {
    readonly code: "CKNE";
    readonly name: string;
    readonly effectiveOn: string;
    readonly href: ResourceLink["href"];
  };
  readonly eligibility: string;
  readonly maintenance: string;
  readonly resources: readonly ResourceLink[];
};

// Domain names and weights follow the linked CNCF curriculum PDFs (CC BY 4.0+).
// Keep IDs stable when editing labels: progress and backups will use these IDs.
export const roadmapData = [
  {
    id: "kcna",
    code: "KCNA",
    name: "Kubernetes and Cloud Native Associate",
    order: 1,
    exam: multipleChoiceExam,
    study: { weeks: [2, 3], hours: [20, 30] },
    suggestedPreparation: "Start here for Kubernetes and cloud native foundations.",
    formalPrerequisites: [],
    domains: [
      {
        id: "kcna-domain-fundamentals",
        name: "Kubernetes Fundamentals",
        weightPercent: 44,
        topics: [
          "Cluster architecture, API primitives and kubectl administration",
          "Pods, Deployments, Services, scheduling and containerization",
          "Kubernetes networking and storage fundamentals",
        ],
      },
      {
        id: "kcna-domain-orchestration",
        name: "Container Orchestration",
        weightPercent: 28,
        topics: [
          "Container runtimes such as containerd and CRI-O, and OCI standards",
          "Container networking (CNI), storage (CSI), and service mesh fundamentals",
          "Orchestration security and basic troubleshooting",
        ],
      },
      {
        id: "kcna-domain-application-delivery",
        name: "Cloud Native Application Delivery",
        weightPercent: 16,
        topics: [
          "CI/CD pipelines, Helm packaging and delivery debugging",
          "GitOps workflows with Argo CD and Flux",
        ],
      },
      {
        id: "kcna-domain-architecture",
        name: "Cloud Native Architecture",
        weightPercent: 12,
        topics: [
          "Cloud native principles, open standards, CNCF Landscape and governance",
          "Community and collaboration across the cloud native ecosystem",
          "Observability with Prometheus and OpenTelemetry across metrics, logs and traces",
        ],
        suggestedPractice: [
          "Compare horizontal, vertical and cluster autoscaling (HPA, VPA and Cluster Autoscaler)",
          "Review serverless deployment models and cloud cost management",
        ],
      },
    ],
    checklist: [
      {
        id: "kcna-step-local-cluster",
        kind: "preparation",
        label: "Set up a local practice cluster with kind or minikube and install kubectl.",
      },
      {
        id: "kcna-step-theory-course",
        kind: "preparation",
        label: "Complete James Spurin’s Udemy KCNA course or the KodeKloud KCNA path.",
      },
      {
        id: "kcna-step-landscape-and-glossary",
        kind: "preparation",
        label: "Review the official CNCF Landscape and use glossary flashcards to revise.",
      },
      {
        id: "kcna-step-mock-exams",
        kind: "preparation",
        label: "Score at least 85% on three or more full KCNA mock exams.",
      },
      {
        id: "kcna-step-pass-exam",
        kind: "exam-pass",
        label: "Register for and pass the KCNA exam.",
        detail: "Check for a Linux Foundation promotion when registering.",
      },
    ],
    resources: [
      { label: "CNCF KCNA certification", href: "https://www.cncf.io/training/certification/KCNA/" },
      { label: "CNCF KCNA curriculum", href: "https://github.com/cncf/curriculum/blob/main/KCNA_Curriculum.pdf" },
      { label: "Register for KCNA", href: "https://training.linuxfoundation.org/certification/kubernetes-cloud-native-associate/" },
      multipleChoiceExamGuide,
      examEligibility,
      candidateHandbook,
      { label: "CNCF Landscape", href: "https://landscape.cncf.io/" },
      { label: "CNCF Cloud Native Glossary", href: "https://glossary.cncf.io/" },
    ],
  },
  {
    id: "cka",
    code: "CKA",
    name: "Certified Kubernetes Administrator",
    order: 2,
    exam: {
      ...handsOnExam,
      simulator: { ...killerSh, excludedRegistration: "CKA-SINGLE" },
    },
    study: { weeks: [5, 8], hours: [60, 80] },
    suggestedPreparation:
      "Build on KCNA knowledge. CKA develops administration skills for CKAD practice and satisfies the CKS exam prerequisite.",
    formalPrerequisites: [],
    domains: [
      {
        id: "cka-domain-cluster-architecture",
        name: "Cluster Architecture, Installation and Configuration",
        weightPercent: 25,
        topics: [
          "Prepare infrastructure and use kubeadm to bootstrap, manage and upgrade clusters",
          "Configure a highly available control plane and manage its lifecycle",
          "Manage RBAC with Roles, ClusterRoles and their bindings",
          "Install cluster components with Helm and Kustomize",
          "Understand CRI, CSI and CNI extension points, CRDs and operators",
        ],
        suggestedPractice: ["Create and restore etcd snapshots in a practice cluster"],
      },
      {
        id: "cka-domain-workloads-and-scheduling",
        name: "Workloads and Scheduling",
        weightPercent: 15,
        topics: [
          "Deployments, DaemonSets, StatefulSets, Jobs and CronJobs",
          "Rolling updates, rollbacks and self-healing workload primitives",
          "ConfigMaps and Secrets for application configuration",
          "Resource requests and limits, taints and tolerations, node and Pod affinity, and autoscaling",
        ],
      },
      {
        id: "cka-domain-services-and-networking",
        name: "Servicing and Networking",
        weightPercent: 20,
        topics: [
          "Pod connectivity and CNI plugins",
          "ClusterIP, NodePort, LoadBalancer and Service endpoints",
          "Ingress resources and controllers, Gateway API traffic routing, CoreDNS and NetworkPolicies",
        ],
      },
      {
        id: "cka-domain-storage",
        name: "Storage",
        weightPercent: 10,
        topics: [
          "StorageClasses and dynamic provisioning",
          "PersistentVolumes and PersistentVolumeClaims, volume types, access modes and reclaim policies",
        ],
        suggestedPractice: ["Expand a dynamically provisioned volume"],
      },
      {
        id: "cka-domain-troubleshooting",
        name: "Troubleshooting",
        weightPercent: 30,
        topics: [
          "Diagnose cluster and node failures and debug control-plane components",
          "Monitor cluster and application resource usage and inspect container output",
          "Troubleshoot Pod and Service networking",
        ],
        suggestedPractice: ["Inspect kubelet and container runtime logs with journalctl and crictl"],
      },
    ],
    checklist: [
      {
        id: "cka-step-cli-fluency",
        kind: "preparation",
        label: "Practice imperative kubectl commands, JSONPath, and fast YAML editing in Vim.",
      },
      {
        id: "cka-step-course-and-labs",
        kind: "preparation",
        label: "Complete Mumshad Mannambeth’s CKA course and all KodeKloud hands-on labs.",
      },
      {
        id: "cka-step-backup-and-upgrades",
        kind: "preparation",
        label: "Practice etcd snapshot backup and restore and kubeadm version upgrades three times from memory.",
      },
      {
        id: "cka-step-simulator",
        kind: "preparation",
        label: "Complete both Killer.sh CKA simulator attempts on a strict two-hour timer.",
        detail: "Standard registration includes simulator access. With CKA-SINGLE, use two separately available timed mocks.",
      },
      {
        id: "cka-step-pass-exam",
        kind: "exam-pass",
        label: "Schedule and pass CKA to qualify to take CKS.",
      },
    ],
    resources: [
      { label: "CNCF CKA certification", href: "https://www.cncf.io/training/certification/cka/" },
      { label: "CNCF CKA curriculum", href: "https://github.com/cncf/curriculum/blob/main/CKA_Curriculum_v1.37.pdf" },
      { label: "Register for CKA", href: "https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/" },
      handsOnExamGuide,
      examEligibility,
      candidateHandbook,
    ],
  },
  {
    id: "ckad",
    code: "CKAD",
    name: "Certified Kubernetes Application Developer",
    order: 3,
    exam: {
      ...handsOnExam,
      simulator: { ...killerSh, excludedRegistration: "CKAD-SINGLE" },
    },
    study: { weeks: [2, 3], hours: [25, 35] },
    suggestedPreparation:
      "Study after CKA to reuse workload, networking and kubectl skills. Spend the remaining time on application design and deployment.",
    formalPrerequisites: [],
    domains: [
      {
        id: "ckad-domain-design-and-build",
        name: "Application Design and Build",
        weightPercent: 20,
        topics: [
          "Build and modify images with Dockerfiles and multi-stage builds",
          "Choose workload resources such as Deployments, DaemonSets, Jobs and CronJobs",
          "Use multi-container Pod patterns such as sidecars, init containers and ambassadors",
          "Use persistent and ephemeral volumes",
        ],
        suggestedPractice: ["Use ephemeral containers for debugging"],
      },
      {
        id: "ckad-domain-deployment",
        name: "Application Deployment",
        weightPercent: 20,
        topics: [
          "Rolling updates, rollbacks, blue-green and canary deployments",
          "Deploy with Helm charts and Kustomize overlays",
        ],
      },
      {
        id: "ckad-domain-observability",
        name: "Application Observability and Maintenance",
        weightPercent: 15,
        topics: [
          "Liveness, readiness and startup probes",
          "Inspect workloads and container logs with kubectl, and diagnose issues with kubectl debug",
          "Identify API deprecations and update manifests",
        ],
      },
      {
        id: "ckad-domain-configuration-and-security",
        name: "Application Environment, Configuration and Security",
        weightPercent: 25,
        topics: [
          "Find and use CRDs and operators",
          "Understand authentication, authorization, admission and ServiceAccounts",
          "Configure SecurityContexts, container capabilities, Secrets and ConfigMaps",
          "Set resource requests and limits, ResourceQuotas and LimitRanges",
        ],
      },
      {
        id: "ckad-domain-services-and-networking",
        name: "Services and Networking",
        weightPercent: 20,
        topics: ["NetworkPolicies, Ingress rules and troubleshooting access through Services"],
      },
    ],
    checklist: [
      {
        id: "ckad-step-delta-modules",
        kind: "preparation",
        label: "Complete CKAD modules on Helm, Kustomize, multi-container Pods, probes, and canary and blue-green deployments.",
      },
      {
        id: "ckad-step-lightning-labs",
        kind: "preparation",
        label: "Complete all KodeKloud CKAD Lightning Labs and mock exams.",
      },
      {
        id: "ckad-step-simulator",
        kind: "preparation",
        label: "Complete both Killer.sh CKAD simulator attempts and aim for under seven minutes per task.",
        detail: "Standard registration includes simulator access. With CKAD-SINGLE, use two separately available timed mocks.",
      },
      {
        id: "ckad-step-pass-exam",
        kind: "exam-pass",
        label: "Schedule and pass the CKAD exam.",
      },
    ],
    resources: [
      { label: "CNCF CKAD certification", href: "https://www.cncf.io/training/certification/ckad/" },
      { label: "CNCF CKAD curriculum", href: "https://github.com/cncf/curriculum/blob/main/CKAD_Curriculum_v1.37.pdf" },
      { label: "Register for CKAD", href: "https://training.linuxfoundation.org/certification/certified-kubernetes-application-developer-ckad/" },
      handsOnExamGuide,
      examEligibility,
      candidateHandbook,
    ],
  },
  {
    id: "kcsa",
    code: "KCSA",
    name: "Kubernetes and Cloud Native Security Associate",
    order: 4,
    exam: multipleChoiceExam,
    study: { weeks: [1, 2], hours: [15, 20] },
    suggestedPreparation:
      "Apply the cluster and application experience from CKA and CKAD to cloud native security concepts.",
    formalPrerequisites: [],
    domains: [
      {
        id: "kcsa-domain-cloud-native-security",
        name: "Overview of Cloud Native Security",
        weightPercent: 14,
        topics: [
          "The four Cs of cloud native security: cloud, cluster, container and code",
          "Cloud provider and infrastructure controls, isolation, and repository and image security",
          "Application and workload security, zero-trust principles and introductory threat modeling",
        ],
      },
      {
        id: "kcsa-domain-cluster-component-security",
        name: "Kubernetes Cluster Component Security",
        weightPercent: 22,
        topics: [
          "Hardening the API server, controller manager, scheduler, kubelet and kube-proxy",
          "etcd encryption at rest and safeguards for runtimes, Pods, networks, clients and storage",
        ],
      },
      {
        id: "kcsa-domain-security-fundamentals",
        name: "Kubernetes Security Fundamentals",
        weightPercent: 22,
        topics: [
          "Pod Security Admission and the Privileged, Baseline and Restricted Pod Security Standards",
          "Authentication, RBAC, Secrets management, segmentation, NetworkPolicies and audit logging",
        ],
      },
      {
        id: "kcsa-domain-threat-model",
        name: "Kubernetes Threat Model",
        weightPercent: 16,
        topics: [
          "Map trust boundaries, data flows and sensitive data in a cluster",
          "Recognize and mitigate persistence, privilege escalation, lateral movement, denial of service and malicious images",
        ],
      },
      {
        id: "kcsa-domain-platform-security",
        name: "Platform Security",
        weightPercent: 16,
        topics: [
          "Supply chain security, SBOMs, image registries and admission controllers",
          "PKI, connectivity safeguards, service mesh security and observability",
        ],
        suggestedPractice: ["Review image signing and verification with Cosign and Sigstore"],
      },
      {
        id: "kcsa-domain-compliance",
        name: "Compliance and Security Frameworks",
        weightPercent: 10,
        topics: [
          "Compliance and threat modeling frameworks, supply chain compliance and automation",
        ],
        suggestedPractice: ["Compare the CIS Kubernetes Benchmark, NIST frameworks and MITRE ATT&CK for Containers"],
      },
    ],
    checklist: [
      {
        id: "kcsa-step-security-domains",
        kind: "preparation",
        label: "Study the KCSA security domains and CIS Kubernetes Benchmark fundamentals.",
      },
      {
        id: "kcsa-step-core-security-models",
        kind: "preparation",
        label: "Review the four Cs, Pod Security Admission and software supply chain security.",
      },
      {
        id: "kcsa-step-practice-tests",
        kind: "preparation",
        label: "Score at least 85% on KCSA practice tests.",
      },
      {
        id: "kcsa-step-pass-exam",
        kind: "exam-pass",
        label: "Schedule and pass the KCSA exam.",
      },
    ],
    resources: [
      { label: "CNCF KCSA certification", href: "https://www.cncf.io/training/certification/kcsa/" },
      { label: "CNCF KCSA curriculum", href: "https://github.com/cncf/curriculum/blob/main/KCSA%20Curriculum.pdf" },
      { label: "Register for KCSA", href: "https://training.linuxfoundation.org/certification/kubernetes-and-cloud-native-security-associate-kcsa/" },
      multipleChoiceExamGuide,
      examEligibility,
      candidateHandbook,
    ],
  },
  {
    id: "cks",
    code: "CKS",
    name: "Certified Kubernetes Security Specialist",
    order: 5,
    exam: {
      ...handsOnExam,
      passingScorePercent: 67,
      simulator: { ...killerSh, excludedRegistration: "CKS-SINGLE" },
    },
    study: { weeks: [4, 6], hours: [50, 70] },
    suggestedPreparation: "Build on CKA administration skills and KCSA security fundamentals.",
    formalPrerequisites: [
      {
        certification: "CKA",
        mustBeCurrent: false,
        description: "Pass CKA before scheduling and taking CKS. Achieved, renewed and expired CKA credentials qualify.",
      },
    ],
    domains: [
      {
        id: "cks-domain-cluster-setup",
        name: "Cluster Setup",
        weightPercent: 15,
        topics: [
          "Restrict access with NetworkPolicies and configure Ingress TLS",
          "Review Kubernetes component configuration against the CIS benchmark",
          "Secure node metadata and endpoints and verify platform binaries before deployment",
        ],
        suggestedPractice: ["Run kube-bench and review hardening for GUI interfaces and nodes"],
      },
      {
        id: "cks-domain-cluster-hardening",
        name: "Cluster Hardening",
        weightPercent: 15,
        topics: [
          "Configure least-privilege RBAC and ServiceAccounts, including disabled token automount where appropriate",
          "Restrict API access and upgrade Kubernetes to address vulnerabilities",
        ],
        suggestedPractice: ["Review API server and kubelet hardening settings"],
      },
      {
        id: "cks-domain-system-hardening",
        name: "System Hardening",
        weightPercent: 10,
        topics: [
          "Reduce host OS footprint, limit external network access and apply least-privilege identity controls",
          "Use AppArmor and seccomp profiles to harden workloads",
        ],
      },
      {
        id: "cks-domain-microservice-vulnerabilities",
        name: "Minimize Microservice Vulnerabilities",
        weightPercent: 20,
        topics: [
          "Apply Pod Security Standards and safely manage Secrets",
          "Isolate workloads through multi-tenancy and sandboxed containers",
          "Encrypt Pod-to-Pod traffic with Cilium or Istio",
        ],
        suggestedPractice: [
          "Write admission policies with OPA Gatekeeper or Kyverno",
          "Configure Secrets encryption at rest and compare gVisor and Kata Containers",
        ],
      },
      {
        id: "cks-domain-supply-chain",
        name: "Supply Chain Security",
        weightPercent: 20,
        topics: [
          "Minimize base images, review SBOMs and secure CI/CD and artifact registries",
          "Restrict registries and sign and verify artifacts",
          "Scan container images for vulnerabilities with Trivy and review manifests with Kubesec or KubeLinter",
        ],
        suggestedPractice: ["Pin images by digest and review ImagePolicyWebhook as an admission control option"],
      },
      {
        id: "cks-domain-runtime-security",
        name: "Monitoring, Logging and Runtime Security",
        weightPercent: 20,
        topics: [
          "Detect anomalous behavior and investigate security incidents across hosts, networks and workloads",
          "Use Kubernetes audit policies and logs to monitor access",
          "Enforce container immutability at runtime",
        ],
        suggestedPractice: ["Configure Falco rules for runtime threat detection in a practice cluster"],
      },
    ],
    checklist: [
      {
        id: "cks-step-course-and-labs",
        kind: "preparation",
        label: "Complete Kim Wüstkamp’s CKS course or KodeKloud CKS with hands-on labs.",
      },
      {
        id: "cks-step-security-controls",
        kind: "preparation",
        label: "Practice Falco rules, Trivy scans, AppArmor and seccomp profiles, kube-bench checks and audit policies from memory.",
      },
      {
        id: "cks-step-simulator",
        kind: "preparation",
        label: "Complete both Killer.sh CKS simulator attempts.",
        detail: "Standard registration includes simulator access. With CKS-SINGLE, use two separately available timed mocks.",
      },
      {
        id: "cks-step-pass-exam",
        kind: "exam-pass",
        label: "Pass CKS and check CNCF’s current Kubestronaut eligibility and onboarding requirements.",
        detail: "Under CARE, earning or renewing CKS aligns a previously earned CKA’s expiration with CKS, including when CKA has expired.",
      },
    ],
    resources: [
      { label: "CNCF CKS certification", href: "https://www.cncf.io/training/certification/cks/" },
      { label: "CNCF CKS curriculum", href: "https://github.com/cncf/curriculum/blob/main/CKS_Curriculum%20v1.37.pdf" },
      { label: "Register for CKS", href: "https://training.linuxfoundation.org/certification/certified-kubernetes-security-specialist/" },
      handsOnExamGuide,
      {
        label: "Linux Foundation CKS prerequisite update",
        href: "https://training.linuxfoundation.org/blog/cks-exam-to-update-september-12-2024/",
      },
      candidateHandbook,
      careProgram,
    ],
  },
] as const satisfies readonly RoadmapStage[];

export type ChecklistItemId = (typeof roadmapData)[number]["checklist"][number]["id"];
