const CANONICAL_HOST = 'coffeematterslondon.com';

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const forwardedProto = context.request.headers.get('x-forwarded-proto');
  const shouldUseHttps = url.protocol !== 'https:' || forwardedProto === 'http';
  const shouldUseBareHost = url.hostname === 'www.coffeematterslondon.com';

  if (shouldUseHttps || shouldUseBareHost) {
    url.protocol = 'https:';
    url.hostname = CANONICAL_HOST;
    return Response.redirect(url.toString(), 301);
  }

  return context.next();
}
