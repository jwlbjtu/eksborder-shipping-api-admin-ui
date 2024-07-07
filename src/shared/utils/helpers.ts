import { PDFDocument, degrees } from 'pdf-lib';
import { FeeRate } from '../types/carrier';
import { ShippingRecord } from '../types/record';
import {
  RATE_BASES,
  CURRENCY_SIGNS,
  CarrierRateType,
  FILE_FORMAT_SIZES_PDF_LIB,
  PACKING_SLIP_FOMAT_SIZES,
  FILE_FORMATS,
  CARRIERS,
  USPS_INTL_SERVICE_IDS_LIST
} from './constants';

export const displayRate = (rate: FeeRate): string => {
  let surfix = rate.ratebase;
  if (rate.ratebase === RATE_BASES.WEIGHT) {
    surfix = `/${rate.weightUnit}`;
  }
  let currencySign = CURRENCY_SIGNS[rate.currency];
  if (rate.ratetype === CarrierRateType.PERSENTAGE) {
    currencySign = '%';
  }
  let data = `${currencySign} ${rate.rate.toFixed(2)} ${surfix}`;
  if (rate.ratetype === CarrierRateType.PERSENTAGE) {
    data = `${rate.rate.toFixed(2)}${currencySign} ${surfix}`;
  }
  return data;
};

export const opentLabelUrlHandler = (shipment: ShippingRecord): void => {
  if (shipment.labelUrlList) {
    shipment.labelUrlList.forEach((url) => window.open(url.labelUrl));
  }
};

export const downloadLabelsHandler = async (
  shipment: ShippingRecord
): Promise<void> => {
  const labels = shipment.labels;
  if (labels && labels.length > 0) {
    const fileSize = FILE_FORMAT_SIZES_PDF_LIB[FILE_FORMATS.thermal];
    const formatSize = PACKING_SLIP_FOMAT_SIZES[FILE_FORMATS.thermal];
    const rootDoc = await PDFDocument.create();
    for (let i = 0; i < labels.length; i += 1) {
      const label = labels[i];
      const labelFormat = label.format;

      const isUSPSIntl =
        shipment.carrier === CARRIERS.USPS &&
        USPS_INTL_SERVICE_IDS_LIST.indexOf(
          shipment.service.id || shipment.service.key
        ) >= 0;

      const verticalLabel = label.carrier === CARRIERS.UPS || isUSPSIntl;

      const page = verticalLabel
        ? rootDoc.addPage([fileSize[1], fileSize[0]])
        : rootDoc.addPage([fileSize[0], fileSize[1]]);

      if (labelFormat === 'PDF') {
        // eslint-disable-next-line no-await-in-loop
        const pdfDoc = await PDFDocument.load(label.data);
        // eslint-disable-next-line no-await-in-loop
        const pdfPage = await rootDoc.embedPage(pdfDoc.getPage(0));
        page.drawPage(pdfPage, {
          x: 0,
          y: 0,
          width: verticalLabel ? fileSize[1] : fileSize[0],
          height: verticalLabel ? fileSize[0] : fileSize[1]
        });
      } else if (labelFormat === 'PNG') {
        // eslint-disable-next-line no-await-in-loop
        const image = await rootDoc.embedPng(label.data);
        if (verticalLabel) {
          page.drawImage(image, {
            x: 30,
            y: 0,
            width: fileSize[1],
            height: fileSize[0]
          });
        } else {
          page.drawImage(image, {
            x: 0,
            y: 0,
            width: fileSize[0],
            height: fileSize[1]
          });
        }
      }
      if (label.isTest && label.carrier === CARRIERS.DHL_ECOMMERCE) {
        page.drawText('Sample', {
          x: formatSize.sample.x,
          y: formatSize.sample.y,
          size: formatSize.sample.font_size,
          rotate: degrees(formatSize.sample.angle)
        });
      }
    }
    const pdfBytes = await rootDoc.save();
    window.open(
      URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }))
    );
  }
};

export const downloadShipmentForms = async (
  shipment: ShippingRecord
): Promise<void> => {
  const forms = shipment.forms;
  if (forms && forms.length > 0) {
    const fileSize = FILE_FORMAT_SIZES_PDF_LIB[FILE_FORMATS.standard];
    const rootDoc = await PDFDocument.create();
    for (let i = 0; i < forms.length; i += 1) {
      const form = forms[i];
      // eslint-disable-next-line no-await-in-loop
      const pdfDoc = await PDFDocument.load(form.data);
      const pageCount = pdfDoc.getPageCount();
      for (let k = 0; k < pageCount; k += 1) {
        const page = rootDoc.addPage([fileSize[0], fileSize[1]]);
        // eslint-disable-next-line no-await-in-loop
        const embededPage = await rootDoc.embedPage(pdfDoc.getPage(k));
        page.drawPage(embededPage, {
          x: 0,
          y: 0,
          width: fileSize[0],
          height: fileSize[1]
        });
      }
    }
    const pdfBytes = await rootDoc.save();
    window.open(
      URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }))
    );
  }
};
