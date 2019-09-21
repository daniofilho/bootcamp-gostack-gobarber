export default function urlMiddleware(url) {
  if (__DEV__) {
    return url.replace('localhost', '10.0.2.2');
  }
  return url;
}
