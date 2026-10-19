import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseConfigurado } from "./publico";

const LOGIN = "/barbeiro/login";
const PAINEL = "/barbeiro/dashboard";

export async function atualizarSessao(request: NextRequest) {
  if (!supabaseConfigurado()) return NextResponse.next({ request });

  let response = NextResponse.next({ request });

  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesParaGravar) {
        cookiesParaGravar.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesParaGravar.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const redirecionar = (destino: string) => {
    const url = request.nextUrl.clone();
    url.pathname = destino;
    url.search = "";
    return NextResponse.redirect(url);
  };

  if (!user && pathname.startsWith(PAINEL)) return redirecionar(LOGIN);
  if (user && pathname === LOGIN) return redirecionar(PAINEL);

  return response;
}
