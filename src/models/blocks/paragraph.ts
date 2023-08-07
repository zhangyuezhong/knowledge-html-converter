import { AlignType } from './align-type';
import { BlockTypes } from './block-type';
import { FontType } from './font-type';
import { ImageBlock } from './image';
import { FontSize, TextBlocks } from './text';
import { VideoBlock } from './video';

export interface ParagraphBlock {
  type: BlockTypes.Paragraph;
  paragraph: {
    blocks: (TextBlocks | ImageBlock | VideoBlock)[];
    properties?: ParagraphProperties;
  };
}

export interface ParagraphProperties {
  fontType?: FontType;
  textColor?: string;
  backgroundColor?: string;
  fontSize?: FontSize;
  indentation?: number;
  align?: AlignType;
}
