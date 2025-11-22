import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <>
      <h1>Info Page</h1>
    </>
  );
});

export const head: DocumentHead = {
  title: "Info",
  meta: [
    {
      name: "info page",
      content: "Qwik site info",
    },
  ],
};
