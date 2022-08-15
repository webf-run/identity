import slugify from '@sindresorhus/slugify';

import { Either } from '../../util/Either';
import { isEqIgnore } from '../../util/unit';
import { ErrorCode } from '../AppError';
import { Context } from '../Context';
import { TagInput } from '../Input';
import { R } from '../R';
import { apply, collect, concat, maxLen, minLen, notEmpty, pattern } from '../../util/validator';
import { v4 } from 'uuid';
import { Tag } from '../Output';


const nameV = concat(
  notEmpty('Tag name should not be empty'),
  minLen(2, 'Tag name must be two characters or more'),
  maxLen(48, 'Tag name should not be more than 48 characters'));

const descriptionV =
  maxLen(140, 'Description should not be more than 140 characters');

const slugV = concat(
  pattern(/^[a-zA-Z0-9-]+$/, 'Slug can have only a-z, A-Z, 0-9 and hypen(-)'),
  pattern(/^[a-zA-Z0-9]/, 'Slug can only begin with alphanumeric character'));

const newTagValidator = apply({
  name: nameV,
  description: descriptionV
});

const updateTagValidator = (tag: Pick<Tag, 'name' | 'description' | 'slug'>) =>
  collect(newTagValidator(tag), slugV(tag.slug));


export async function createTag({ db }: Context, newTag: TagInput): DomainResult<Tag> {

  const slug = slugify(newTag.name);

  const validationRs = newTagValidator({
    name: newTag.name,
    description: newTag.description || ''
  });

  if (Either.isLeft(validationRs)) {
    const errors = validationRs.value;
    const message = errors.join('\n');

    return R.ofError(ErrorCode.INVALID_DATA, message);
  }

  // DB READ
  const matchingTags = await db.tag.findBySimilarSlug({ slugPattern: `${slug}%` });

  const isExactMatch = matchingTags.some((x) => isEqIgnore(x.name, newTag.name));

  if (isExactMatch) {
    return R.ofError(ErrorCode.ALREADY_EXISTS, 'Tag already exists');
  }

  const nextIndex = matchingTags.length + 1;
  const adjustedSlug = nextIndex > 1 ? `${slug}-${nextIndex}` : slug;

  // DB Insert
  const results = await db.tag.createNewTag({
    id: v4(),
    name: newTag.name.trim(),
    slug: adjustedSlug,
    description: newTag.description || '',
    approved: false,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const tag: Tag = results[0];

  return R.of(tag);
}


export async function updateTag(ctx: Context, tagId: string, newTag: TagInput): DomainResult<Tag> {

  const results = await ctx.db.tag.getTagById({ id: tagId });

  const tag = results.at(0);


  if (!tag) {
    return R.ofError(ErrorCode.NOT_FOUND, 'Tag not found');
  }

  const validationRs = updateTagValidator({
    name: newTag.name,
    description: newTag.description || '',
    slug: newTag.slug || tag.slug
  });

  if (Either.isLeft(validationRs)) {
    const errors = validationRs.value;
    const message = errors.join('\n');

    return R.ofError(ErrorCode.INVALID_DATA, message);
  }

  const updated = await ctx.db.tag.updateTag({
    id: tag.id,
    name: newTag.name.trim(),
    description: newTag.description || '',
    slug: newTag.slug || tag.slug
  });

  return R.of(updated[0]);
}
