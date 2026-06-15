export function HomeSummary() {
  return (
    <section className="border-y border-slate-200 bg-white py-8">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-4 lg:grid-cols-[0.5fr_1.5fr] lg:items-center">
          <p className="text-sm font-semibold text-slate-500">TL;DR</p>
          <div className="space-y-3 text-xl font-semibold leading-9 text-slate-950 sm:text-2xl sm:leading-10">
            <p>我做的事情，简单说就是：别让系统看错价值。</p>
            <p className="text-slate-700">
              有些作者值得被扶持，有些内容值得被分发，有些用户需求不该被忽略。
            </p>
            <p className="text-slate-500">
              我的工作是把这些判断变成标准、实验和推荐 / 搜索 / 商业化系统能用的策略。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
