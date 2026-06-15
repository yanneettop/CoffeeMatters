const CANONICAL_HOST = 'www.coffeematterslondon.com';

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const forwardedProto = context.request.headers.get('x-forwarded-proto');
  const shouldUseHttps = url.protocol !== 'https:' || forwardedProto === 'http';
  const shouldUseWww = url.hostname === 'coffeematterslondon.com';

  if (shouldUseHttps || shouldUseWww) {
    url.protocol = 'https:';
    url.hostname = CANONICAL_HOST;
    return Response.redirect(url.toString(), 301);
  }

  return context.next();
}
