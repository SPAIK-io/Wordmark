"use client";
import { cn } from "@/lib/utils";

export function Credits({
  className,
  isMobileViewVisible = false,
}: {
  className?: string;
  isMobileViewVisible: boolean;
}) {
  return (
    <div
      className={cn(
        "mx-auto flex w-fit flex-col items-center justify-center gap-4 space-y-4 px-8 text-center text-xs  [text-wrap:balance] sm:py-0",
        {
          "block rounded-md border py-4 md:hidden": isMobileViewVisible,
          "absolute bottom-4 hidden md:block": !isMobileViewVisible,
        },
        className,
      )}
    >
      <div className="mx-auto flex h-fit w-fit items-center gap-2 rounded-md border p-2 text-center align-middle">
        <div className="font-semibold">SPAIK Logomaker</div>
        <span className="text-muted-foreground">Internal Branding Tool</span>
      </div>
      {/* <Link
        href="https://www.producthunt.com/posts/wordmark-7584b39f-f3da-41d9-aedf-18c59cf1228e?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-wordmark&#0045;7584b39f&#0045;f3da&#0045;41d9&#0045;aedf&#0045;18c59cf1228e"
        target="_blank"
        className="flex justify-center w-full"
      >

        <img
          src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=425883&theme=light"
          alt="Wordmark&#0046; - Google&#0032;font&#0032;logo&#0032;maker | Product Hunt"
          style={{ width: "250px", height: "54px" }}
          width="250"
          height="54"
        />
      </Link> */}
      <div>
        <span className="text-muted-foreground">
          Export presets for marketing, sales, and product launches.
        </span>
      </div>
    </div>
  );
}
