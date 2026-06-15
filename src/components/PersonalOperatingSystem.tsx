const operatingNotes = [
  {
    label: "Companion",
    title: "持续迭代",
    body: "为作品集保留一个轻松的个人符号，也提醒自己持续观察、验证和改进。",
  },
  {
    label: "Rap Culture",
    title: "内容背后有人",
    body: "我喜欢有真实处境的人，把欲望、痛苦、态度和观察讲出来。我不反感商业，但反感商业把毛边磨没。",
  },
  {
    label: "United Lens",
    title: "资源不等于结果",
    body: "当一个系统反复投入资源却没有结果，真正要看的不是谁不够努力，而是组织有没有形成稳定合力。",
    link: {
      href: "/thinking",
      label: "阅读思考笔记",
      external: false,
    },
  },
  {
    label: "FIFA / FM",
    title: "一个临场，一个系统",
    body: "FIFA 训练我在压力里做动作，FM 训练我把目标、资源和长期反馈放在一张图里看。",
  },
];

export function PersonalOperatingSystem() {
  return (
    <section
      id="personal-thinking"
      className="mx-auto max-w-[1680px] scroll-mt-24 px-4 pb-5 sm:px-8"
    >
      <div className="rounded-[8px] border border-[#14110e]/25 bg-[#fff8eb] p-4 shadow-[0_18px_48px_rgba(20,17,14,0.12)] sm:p-5">
        <div className="mb-5 grid gap-4 border-b border-[#14110e]/18 pb-4 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className="font-mono text-xs font-semibold uppercase text-[#c92a20]">
              Beyond Work
            </p>
            <h2 className="mt-2 [font-family:var(--font-display)] text-2xl font-semibold leading-tight tracking-normal text-[#14110e] sm:text-3xl">
              我的个人操作系统
            </h2>
          </div>
          <p className="text-[0.95rem] leading-7 text-[#3a2e24]">
            视觉墙负责给第一眼的冲击，这里只留下结论：我理解内容、人和系统的方式，很多来自工作之外。
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {operatingNotes.map((note) => (
            <article
              key={note.title}
              className="flex min-h-56 flex-col justify-between rounded-[8px] border border-[#8b3a28]/18 bg-[#fffdf8] p-4"
            >
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-normal text-[#c92a20]">
                  {note.label}
                </p>
                <h3 className="mt-3 text-xl font-semibold tracking-normal text-[#14110e]">
                  {note.title}
                </h3>
                <p className="mt-3 text-[0.86rem] leading-6 text-[#4b3829]">
                  {note.body}
                </p>
              </div>

              {note.link ? (
                <a
                  href={note.link.href}
                  target={note.link.external ? "_blank" : undefined}
                  rel={note.link.external ? "noreferrer" : undefined}
                  className="mt-5 inline-flex w-fit rounded-[6px] border border-[#8b3a28]/25 px-4 py-2 text-sm font-semibold text-[#14110e] transition hover:border-[#c92a20] hover:text-[#c92a20]"
                >
                  {note.link.label}
                </a>
              ) : (
                <div className="mt-5 h-px bg-[#8b3a28]/18" />
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
