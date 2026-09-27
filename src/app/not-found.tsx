import type { Metadata } from "next";
import { StaticPageLink } from "@/components/StaticPageLink";

export const metadata: Metadata = {
  title: "页面未找到",
  description: "请求的作品集页面不存在。",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <>
      <meta name="robots" content="noindex,nofollow" />
      <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-3xl place-items-center px-5 py-16 text-center sm:px-8">
      <section>
        <p className="text-sm font-semibold text-sky-700">404</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal text-slate-950">
          没有找到这个项目
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          当前链接不在项目集中，可以返回首页查看 3 个已整理的代表项目。
        </p>
        <StaticPageLink
          href="/"
          className="mt-8 inline-flex rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          返回首页
        </StaticPageLink>
      </section>
      </main>
    </>
  );
}
