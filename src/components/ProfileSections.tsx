import type { Profile } from "@/types/project";

type ProfileSectionProps = {
  profile: Profile;
};

export function AboutSection({ profile }: ProfileSectionProps) {
  return (
    <section id="about" className="mx-auto max-w-[1680px] px-4 pb-5 sm:px-8">
      <div className="grid gap-6 rounded-[8px] border border-[#14110e]/25 bg-[#fff8eb] p-4 shadow-[0_18px_48px_rgba(20,17,14,0.12)] sm:p-5 lg:grid-cols-[0.7fr_1.3fr]">
        <div>
          <p className="font-mono text-xs font-semibold uppercase text-[#c92a20]">
            About Me
          </p>
          <h2 className="mt-2 [font-family:var(--font-display)] text-2xl font-semibold leading-tight tracking-normal text-[#14110e] sm:text-3xl">
            我不太相信单一指标。
          </h2>
        </div>
        <div className="grid gap-4">
          {profile.about.map((paragraph) => (
            <p
              key={paragraph}
              className="rounded-[6px] border-l-4 border-[#c92a20] bg-[#fff2d8] px-4 py-3 text-[0.95rem] leading-7 text-[#3a2e24]"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CapabilitiesSection({ profile }: ProfileSectionProps) {
  return (
    <section id="capabilities" className="mx-auto max-w-[1680px] px-4 pb-5 sm:px-8">
      <div className="rounded-[8px] border border-[#14110e] bg-[#14110e] p-4 text-[#fff8eb] shadow-[0_18px_48px_rgba(20,17,14,0.16)] sm:p-5">
        <div className="mb-5 flex flex-col justify-between gap-3 border-b border-[#c92a20]/45 pb-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs font-semibold uppercase text-[#e13024]">
              Capability Stack
            </p>
            <h2 className="mt-2 [font-family:var(--font-display)] text-2xl font-semibold leading-tight tracking-normal sm:text-3xl">
              我能反复使用的几种判断能力
            </h2>
          </div>
          <p className="max-w-2xl text-[0.9rem] leading-6 text-[#d8c9b4]">
            不是工具清单，而是我在不同业务里反复用到的能力：定义标准、校准价值、推动系统使用。
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {profile.capabilityGroups.map((group) => (
            <div
              key={group.title}
              className="rounded-[8px] border border-[#fff8eb]/18 bg-[#fff8eb]/5 p-4"
            >
              <h3 className="text-base font-semibold">{group.title}</h3>
              <div className="mt-3 grid gap-2">
                {group.items.map((item) => (
                  <div
                    key={item}
                    className="rounded-[6px] bg-[#fff8eb] px-3 py-2 text-[0.84rem] font-medium text-[#14110e]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FieldNotesSection({ profile }: ProfileSectionProps) {
  return (
    <section id="insights" className="mx-auto max-w-[1680px] px-4 pb-5 sm:px-8">
      <div className="rounded-[8px] border border-[#14110e]/25 bg-[#fff8eb] p-4 shadow-[0_18px_48px_rgba(20,17,14,0.12)] sm:p-5">
        <div className="mb-5 flex flex-col justify-between gap-3 border-b border-[#14110e]/18 pb-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs font-semibold uppercase text-[#c92a20]">
              Field Notes
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-normal text-[#14110e]">
              会继续写下去的专业主题
            </h2>
          </div>
          <p className="max-w-2xl text-[0.9rem] leading-6 text-[#5b4635]">
            这些不是为了显得会总结，而是我想长期追的问题：标准怎么定，价值怎么识别，AI 怎么参与判断。
          </p>
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          {profile.insights.map((insight) => (
            <article
              key={insight.title}
              className="rounded-[8px] border border-[#8b3a28]/18 bg-[#fffdf8] p-4"
            >
              <p className="font-mono text-xs font-semibold uppercase text-[#c92a20]">
                Insight
              </p>
              <h3 className="mt-3 text-lg font-semibold leading-6 text-[#14110e]">
                {insight.title}
              </h3>
              <p className="mt-3 text-[0.86rem] leading-6 text-[#4b3829]">
                {insight.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ExperienceSection({ profile }: ProfileSectionProps) {
  return (
    <section id="experience" className="mx-auto max-w-[1680px] px-4 pb-5 sm:px-8">
      <div className="rounded-[8px] border border-[#14110e]/25 bg-[#fff8eb] p-4 shadow-[0_18px_48px_rgba(20,17,14,0.12)] sm:p-5">
        <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="font-mono text-xs font-semibold uppercase text-[#c92a20]">
              经历脉络
            </p>
            <h2 className="mt-2 text-2xl font-semibold leading-tight tracking-normal text-[#14110e]">
              从搜索质量到内容生态，再到作者变现
            </h2>
            <p className="mt-4 text-[0.95rem] leading-7 text-[#3a2e24]">
              职业路径围绕“理解内容、评估质量、调优流量、沉淀机制”持续展开，既有冷启动和增长阶段，也有成熟业务商业化阶段。
            </p>
          </div>
          <div className="grid gap-3">
            {profile.experiences.map((experience) => (
              <div
                key={`${experience.company}-${experience.period}`}
                className="grid gap-4 rounded-[8px] border border-[#8b3a28]/18 bg-[#fffdf8] p-4 sm:grid-cols-[10rem_1fr]"
              >
                <div>
                  <div className="text-sm font-semibold text-[#14110e]">
                    {experience.period}
                  </div>
                  <div className="mt-1 text-xs text-[#80654d]">
                    {experience.title}
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#14110e]">
                    {experience.company}
                  </h3>
                  <p className="mt-2 text-[0.86rem] leading-6 text-[#4b3829]">
                    {experience.focus}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ActionPrinciplesSection() {
  return (
    <section className="mx-auto max-w-[1680px] px-4 pb-5 sm:px-8">
      <div className="grid gap-3 lg:grid-cols-3">
        <Principle
          label="策略判断"
          title="先定义好目标和评估口径"
          body="将业务目标拆成可观测指标、可解释标签和可落地策略，减少团队协作中的口径损耗。"
          color="text-[#c92a20]"
        />
        <Principle
          label="流量机制"
          title="让内容价值进入分发系统"
          body="围绕推荐、搜索、关注流和商业化流量，持续优化内容、作者和用户之间的匹配效率。"
          color="text-[#c92a20]"
        />
        <Principle
          label="跨团队落地"
          title="连接算法、研发和运营动作"
          body="通过策略框架、实验分析和产品机制，把复杂业务问题推进到真实结果。"
          color="text-[#c92a20]"
        />
      </div>
    </section>
  );
}

function Principle({
  label,
  title,
  body,
  color,
}: {
  label: string;
  title: string;
  body: string;
  color: string;
}) {
  return (
    <div className="rounded-[8px] border border-[#8b3a28]/18 bg-[#fffdf8] p-4 shadow-[0_14px_34px_rgba(20,17,14,0.08)]">
      <p className={`font-mono text-xs font-semibold uppercase ${color}`}>
        {label}
      </p>
      <h3 className="mt-3 text-lg font-semibold text-[#14110e]">{title}</h3>
      <p className="mt-3 text-[0.86rem] leading-6 text-[#4b3829]">{body}</p>
    </div>
  );
}
