import { Tag, Prisma } from '@prisma/client';
import slugify from '@sindresorhus/slugify';

import { Context } from '../../context';
import { Either } from '../../util/Either';
import { isEqIgnore } from '../../util/unit';
import { AppError, ErrorCode } from '../AppError';
import { R } from '../R';
import { collect, concat, maxLen, minLen, notEmpty } from '../validator';
import { TagInput } from './type';


export async function createTag({ db }: Context, newTag: TagInput): DomainResult<Tag> {

  const slug = slugify(newTag.name);

  const validationRs = validator({
    name: newTag.name,
    description: newTag.description || ''
  });

  if (Either.isLeft(validationRs)) {
    const errors = validationRs.value;
    const message = errors.join('\n');

    return R.ofError(ErrorCode.INVALID_DATA, message);
  }

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
      name: newTag.name.trim(),
      slug: adjustedSlug,
      description: newTag.description || '',
      approved: false
    }
  });

  return R.of(tag);
}

export async function updateTag(ctx: Context, tagId: string, newTag: TagInput) {

  const tag = await ctx.db.tag.findUnique({
    where: {
      id: BigInt(tagId)
    }
  });

  if (!tag) {
    return R.ofError(ErrorCode.NOT_FOUND, 'Tag not found');
  }

  const validationRs = validator({
    name: newTag.name,
    description: newTag.description || ''
  });

  if (Either.isLeft(validationRs)) {
    const errors = validationRs.value;
    const message = errors.join('\n');

    return R.ofError(ErrorCode.INVALID_DATA, message);
  }

  const updated = await ctx.db.tag.update({
    where: {
      id: tag.id
    },
    data: {
      name: newTag.name.trim(),
      description: newTag.description || '',
      slug: newTag.slug || tag.slug
    }
  });

  return updated;
}


const validator = collect<Tag, string>({
  name: concat(
    notEmpty('Tag should not be empty'),
    minLen(2, 'Tag name must be two characters or more'),
    maxLen(48, 'Tag name should not be more than 48 characters')),

  description: maxLen(140, 'Description should not be more than 140 characters')
});
