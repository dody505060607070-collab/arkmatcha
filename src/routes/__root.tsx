import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ScrollReveal } from "@/components/site/ScrollReveal";
import { ThemeApplier } from "@/components/site/ThemeApplier";
import { supabase } from "@/integrations/supabase/client";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-6xl text-[color:var(--forest)]">404</h1>
        <p className="mt-3 text-[color:var(--muted-foreground)]">This page doesn't exist.</p>
        <Link to="/" className="btn-primary mt-6 inline-flex">Back home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-2xl">Something went off.</h1>
        <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">Please try again.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={() => { router.invalidate(); reset(); }} className="btn-primary">Try again</button>
          <a href="/" className="btn-ghost">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Ark Matcha | Ceremonial Grade Matcha Made in Japan" },
      {
        name: "description",
        content:
          "Shop Ark Matcha ceremonial grade matcha made in Japan, available in 30g and 50g premium tins. A calm, elegant matcha ritual made for smooth daily energy.",
      },
      { name: "author", content: "Ark Matcha" },
      { property: "og:title", content: "Ark Matcha | Ceremonial Grade Matcha Made in Japan" },
      {
        property: "og:description",
        content:
          "Shop Ark Matcha ceremonial grade matcha made in Japan, available in 30g and 50g premium tins. A calm, elegant matcha ritual made for smooth daily energy.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Ark Matcha" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Ark Matcha | Ceremonial Grade Matcha Made in Japan" },
      { name: "description", content: "Shop Ark Matcha ceremonial grade matcha made in Japan, available in 30g and 50g premium tins. A calm, elegant matcha ritual made for smooth daily energy." },
      { property: "og:description", content: "Shop Ark Matcha ceremonial grade matcha made in Japan, available in 30g and 50g premium tins. A calm, elegant matcha ritual made for smooth daily energy." },
      { name: "twitter:description", content: "Shop Ark Matcha ceremonial grade matcha made in Japan, available in 30g and 50g premium tins. A calm, elegant matcha ritual made for smooth daily energy." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/1yJHT2oX2FhsOOMEzpl3o2LwdU93/social-images/social-1784411035926-IMG_9150.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/1yJHT2oX2FhsOOMEzpl3o2LwdU93/social-images/social-1784411035926-IMG_9150.webp" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hideChrome = pathname.startsWith("/admin") || pathname === "/auth";

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => sub.subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeApplier />
      <div className="flex min-h-screen flex-col">
        {!hideChrome && <Header />}
        <div className="flex-1">
          <Outlet />
        </div>
        {!hideChrome && <Footer />}
      </div>
      <ScrollReveal />
      <Toaster richColors position="top-center" />
    </QueryClientProvider>
  );
}
