import {
  NextRequest,
  NextFetchEvent,
  userAgent,
  NextResponse,
} from "next/server";
export function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (req.nextUrl.pathname.startsWith("/chats")) {
    console.log("only chats middleware");
  } else if (req.nextUrl.pathname.startsWith("/")) {
    const { isBot } = userAgent(req);
    if (isBot && !req.url.includes("/isBot")) {
      const url = req.nextUrl.clone();
      url.pathname = "/isBot";
      return NextResponse.redirect(url);
    }
    if (!req.url.includes("/api")) {
      if (
        !req.url.includes("/enter") &&
        !req.url.includes("/isBot") &&
        !req.cookies.get("carrotSession")
      ) {
        return NextResponse.redirect(`${req.nextUrl.origin}/enter`);
      }
    }
  }
}
