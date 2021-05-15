import { Tag } from '@prisma/client';
import slugify from '@sindresorhus/slugify';

import { Context } from '../../context';
import { isEqIgnore } from '../../util/unit';
import { ErrorCode } from '../AppError';
import { R } from '../R';
import { TagInput } from './type';


export async function createTag({ db }: Context, newTag: TagInput): DomainResult<Tag> {

  const slug = slugify(newTag.name);

  // DB READ
  const matchingTags = await db.tag.findMany({
    select: { id: true, name: true, slug: true },
    where: { slug: { startsWith: slug, mode: 'insensitive' } }
  });

  const isExactMatch = matchingTags.some((x) => isEqIgnore(x.name, newTag.name));

  if (isExactMatch) {
    return R.ofError(ErrorCode.ALREADY_EXISTS, 'Tag already exists');
  }

  const nextIndex = matchingTags.length + 1;
  const adjustedSlug = nextIndex > 1 ? `${slug}-${nextIndex}` : slug;

  // DB Insert
  const tag: Tag = await db.tag.create({
    data: {
      name: newTag.name,
      slug: adjustedSlug,
      description: newTag.description || '',
      approved: false
    }
  });

  return R.of(tag);
}
