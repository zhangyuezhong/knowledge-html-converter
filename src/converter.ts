import { parse, AstElement } from 'html-parse-stringify';
import { sanitizeHtml } from './sanitizer';
import { TagNames } from './models';
import { Block } from './models/block';
import { BlockTypes } from './models/blocks/block-type';
import { generateParagraphBlock } from './converters/paragraph';
import { generateListBlock } from './converters/list';
import { generateVideoBlock } from './converters/video';
import { generateImageBlock } from './converters/image';
import { generateTableBlock } from './converters/table';

export const convertHtmlToBlocks = (html: string): Block[] => {
  if (!html) {
    return [];
  }
  const sanitizedHtml = sanitizeHtml(html);
  const parsedHtml = parse(sanitizedHtml);
  return convertParsedHtmlToBlocks(parsedHtml);
};

const convertParsedHtmlToBlocks = (parsedHtml: AstElement[]): Block[] => {
  const blocks: Block[] = [];

  parsedHtml.forEach((blockData: AstElement) => {
    let block: Block | undefined;
    switch (blockData.name) {
      case TagNames.Paragraph:
      case TagNames.Heading1:
      case TagNames.Heading2:
      case TagNames.Heading3:
      case TagNames.Heading4:
      case TagNames.Heading5:
      case TagNames.Heading6:
      case TagNames.Preformatted:
        block = generateParagraphBlock(blockData);
        break;
      case TagNames.OrderedList:
        block = generateListBlock(blockData, BlockTypes.OrderedList);
        break;
      case TagNames.UnorderedList:
        block = generateListBlock(blockData, BlockTypes.UnorderedList);
        break;
      case TagNames.Image:
        block = generateImageBlock(blockData);
        break;
      case TagNames.Video:
        block = generateVideoBlock(blockData);
        break;
      case TagNames.Table:
        block = generateTableBlock(blockData);
        break;
    }

    if (block) {
      blocks.push(block);
    }
  });

  return blocks;
};
