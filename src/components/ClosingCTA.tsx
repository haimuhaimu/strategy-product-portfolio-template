import type { ContactConfig } from "@/types/project";

export function ClosingCTA({ contact }: { contact: ContactConfig }) {
  return (
    <section id="contact" className="mx-auto max-w-7xl px-4 py-14 sm:px-8 sm:py-20">
      <div className="rounded-2xl bg-[#14110e] px-6 py-10 text-white sm:px-10 sm:py-12">
        <p className="font-mono text-sm font-semibold text-[#e85a4f]">CONTACT</p>
        <div className="mt-3 grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h2 className="text-3xl font-semibold sm:text-4xl">{contact.title}</h2>
            <p className="mt-4 max-w-2xl leading-7 text-[#d8c9b4]">{contact.description}</p>
          </div>
          <a href={`mailto:${contact.email}`} className="rounded-lg bg-[#c92a20] px-6 py-3 text-center font-semibold text-white transition hover:bg-[#e13b30]">{contact.email}</a>
        </div>
      </div>
    </section>
  );
}
