export async function onRequest(context) {
  const url = new URL(context.request.url);
  const forwardedProto = context.request.headers.get('x-forwarded-proto');
  const shouldUseHttps = url.protocol !== 'https:' || forwardedProto === 'http';

  if (shouldUseHttps) {
    url.protocol = 'https:';
    return Response.redirect(url.toString(), 301);
  }

  return context.next();
}
