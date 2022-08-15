export function validatePost(post: any) {
  if (typeof post === 'object' && post !== null) {
    return true;
  } else {
    return false;
  }
}
