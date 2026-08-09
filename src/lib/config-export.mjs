const modeCopy = {
  product: {
    role: "产品经理",
    headline: "用问题定义、方案判断与结果证据展示产品能力",
  },
  operations: {
    role: "产品运营",
    headline: "用目标拆解、运营动作与增长结果展示运营能力",
  },
};

function slugify(value, index) {
  const slug = value.trim().toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/gu, "-").replace(/^-|-$/gu, "");
  return slug || `project-${index + 1}`;
}

export function createPortfolioExport(form) {
  const mode = form.mode === "operations" ? "operations" : "product";
  const projects = form.projects.slice(0, 3).map((item, index) => {
    const challenge = mode === "product" ? item.problem : item.goal;
    const approach = mode === "product" ? item.method : item.actions;
    const slug = slugify(item.title, index);
    return {
      slug,
      title: item.title || `代表项目 ${index + 1}`,
      subtitle: challenge || "请补充项目问题或目标",
      company: "项目经历",
      period: "",
      domain: mode === "product" ? "产品项目" : "运营项目",
      order: index + 1,
      summary: `${challenge || "待补充背景"} ${approach || "待补充方法"}`.trim(),
      keywords: mode === "product" ? ["问题定义", "产品方案", "结果验证"] : ["目标拆解", "运营动作", "增长复盘"],
      metrics: [{ label: "核心结果", value: item.result || "待补充" }],
      background: challenge || "请补充项目背景。",
      caseStudy: {
        question: challenge || "这个项目要解决什么？",
        productMethod: approach ? [approach] : [],
        algorithmAndData: [],
        evaluation: item.result ? [item.result] : [],
        artifact: item.artifact ? [item.artifact] : [],
      },
      roleContribution: {
        scope: item.contribution || "待补充个人职责范围",
        judgment: item.contribution || "待补充关键判断",
        usedBy: "待补充协作对象",
        boundary: item.contribution || "待补充个人与团队贡献边界",
      },
      actions: approach ? [approach] : [],
      results: item.result ? [item.result] : [],
    };
  });

  return {
    schemaVersion: 2,
    rolePreset: mode,
    home: {
      introEyebrow: mode === "product" ? "产品经理作品集" : "运营作品集",
      introTitle: form.headline || modeCopy[mode].headline,
      evidenceTitle: "用结果说明工作价值",
      evidenceMetrics: projects.map((project) => project.metrics[0]),
    },
    features: { profile: false, thinking: false, advancedModels: false },
    contact: {
      title: "期待与你交流",
      description: "如果这些项目与你正在解决的问题有关，欢迎通过邮件联系。",
      email: form.email || "hello@example.com",
    },
    featuredProjectSlugs: projects.map((project) => project.slug),
    profile: {
      name: form.name || "你的名字",
      role: form.role || modeCopy[mode].role,
      location: "",
      phone: "",
      email: form.email || "hello@example.com",
      headline: form.headline || modeCopy[mode].headline,
      summary: form.summary || "请用两三句话介绍你擅长解决的问题。",
      about: [], tags: [], interests: [], positioning: [], methodology: [], insights: [],
      workGroups: [], capabilityGroups: [], experiences: [],
    },
    personalOperatingSystem: { personModel: [], rewardFunction: [], actionStrategy: [] },
    influences: [], trainingHistory: [], calibrationLogs: [], projects,
  };
}
