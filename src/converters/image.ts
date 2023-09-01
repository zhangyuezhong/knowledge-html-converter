import { DomNode } from 'html-parse-stringify';
import { StyleAttribute } from '../models/html';
import { DocumentBodyBlockAlignType } from '../models/blocks/document-body-block';
import {
  DocumentBodyImage,
  DocumentBodyImageBlock,
  DocumentBodyImageProperties,
} from '../models/blocks/document-body-image';

export const generateImageBlock = (
  imageElement: DomNode,
  imageProperties: DocumentBodyImageProperties = {},
  hyperlink: string | undefined = undefined,
): DocumentBodyImageBlock => {
  return {
    type: 'Image',
    image: generateImage(imageElement, imageProperties, hyperlink),
  };
};

const generateImage = (
  imageElement: DomNode,
  imageProperties: DocumentBodyImageProperties = {},
  hyperlink: string | undefined = undefined,
): DocumentBodyImage => {
  let imgUrl = imageElement.attrs?.src || '';
  imgUrl = imgUrl
    .replace(/&amp;/g, '&')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&quot;/g, '"');
  const backgroundColor = imageProperties?.backgroundColor;
  let properties = getImageProperties(imageElement);
  if (backgroundColor) {
    properties = { ...properties, ...{ backgroundColor } };
  }
  return Object.assign(
    {},
    { url: imgUrl },
    hyperlink && { hyperlink },
    properties && { properties },
  );
};

const getImageProperties = (
  imageElement: DomNode,
): DocumentBodyImageProperties | undefined => {
  let imageProperties: DocumentBodyImageProperties | undefined;
  if (imageElement.attrs) {
    let align: DocumentBodyBlockAlignType | undefined;
    let backgroundColor: string | undefined;
    if (imageElement.attrs.style) {
      imageElement.attrs.style
        .split(/\s*;\s*/) //split with extra spaces around the semi colon
        .map((chunk) => chunk.split(/\s*:\s*/)) //split key:value with colon
        .map((keyValue) => {
          if (keyValue.length === 2) {
            if (
              keyValue[0] === StyleAttribute.Float &&
              keyValue[1].toLocaleLowerCase() === 'left'
            ) {
              align = DocumentBodyBlockAlignType.Left;
              return;
            } else if (
              keyValue[0] === StyleAttribute.Float &&
              keyValue[1].toLocaleLowerCase() === 'right'
            ) {
              align = DocumentBodyBlockAlignType.Right;
              return;
            } else if (
              keyValue[0] === 'display' &&
              keyValue[1].toLocaleLowerCase() === 'block'
            ) {
              // For center tiny mce adds style as "display: block; margin-left: auto; margin-right: auto;"
              align = DocumentBodyBlockAlignType.Center;
              return;
            }
          }
        });
    }
    if (align || backgroundColor) {
      imageProperties = Object.assign(
        {},
        align && { align },
        backgroundColor && { backgroundColor },
      );
    }
  }
  return imageProperties;
};

export const convertRgbToHex = (rgb: string): string | undefined => {
  const colorsArray = rgb
    ?.replace('rgb(', '')
    .replace('rgba(', '')
    .replace(')', '')
    .replace(';', '')
    .split(/\s*,\s*/)
    .map((x) => Number.parseInt(x, 10));
  // If rgba(r,g,b,a), exclude opacity
  if (colorsArray?.length === 4) {
    colorsArray.pop();
  }
  return colorsArray?.length === 3
    ? rgbToHex(colorsArray[0], colorsArray[1], colorsArray[2])
    : undefined;
};

const rgbToHex = (red: number, green: number, blue: number): string => {
  return (
    '#' + componentToHex(red) + componentToHex(green) + componentToHex(blue)
  );
};

const componentToHex = (c: number): string => {
  const hex = c.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
};
