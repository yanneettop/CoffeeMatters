export async function onRequest(context) {
  const url = new URL(context.request.url);
  const preferredHost = 'www.coffeematterslondon.com';
  const finalPathRedirects = new Map([
    ['/menu', '/menu/'],
    ['/gallery', '/gallery/'],
    ['/about', '/about/'],
    ['/contact', '/contact/'],
  ]);
  const forwardedProto = context.request.headers.get('x-forwarded-proto');
  const shouldUseHttps = url.protocol !== 'https:' || forwardedProto === 'http';
  const shouldUseWww = url.hostname === 'coffeematterslondon.com';
  const finalPath = finalPathRedirects.get(url.pathname);

  if (shouldUseHttps || shouldUseWww || finalPath) {
    url.protocol = 'https:';
    url.hostname = preferredHost;
    if (finalPath) url.pathname = finalPath;
    return Response.redirect(url.toString(), 301);
  }

  return context.next();
}
