import { PDFDocument } from 'pdf-lib';
import { FeeRate } from '../types/carrier';
import { ShippingRecord } from '../types/record';
import {
  RATE_BASES,
  CURRENCY_SIGNS,
  CarrierRateType,
  FILE_FORMAT_SIZES_PDF_LIB,
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

export const downloadLabelsHandler = async (
  shipment: ShippingRecord
): Promise<void> => {
  const labels = shipment.labels;
  if (labels && labels.length > 0) {
    const fileSize = FILE_FORMAT_SIZES_PDF_LIB[FILE_FORMATS.thermal];
    const rootDoc = await PDFDocument.create();
    for (let i = 0; i < labels.length; i += 1) {
      const label = labels[i];
      const labelFormat = label.format;

      const isUSPSIntl =
        shipment.carrier === CARRIERS.USPS &&
        USPS_INTL_SERVICE_IDS_LIST.indexOf(
          shipment.service.id || shipment.service.key
        ) >= 0;

      if (labelFormat === 'PDF') {
        // eslint-disable-next-line no-await-in-loop
        const pdfDoc = await PDFDocument.load(label.labelData);
        const pageCount = pdfDoc.getPageCount();
        for (let k = 0; k < pageCount; k += 1) {
          const page =
            shipment.carrier === CARRIERS.UPS || isUSPSIntl
              ? rootDoc.addPage([fileSize[1], fileSize[0]])
              : rootDoc.addPage([fileSize[0], fileSize[1]]);
          // eslint-disable-next-line no-await-in-loop
          const embededPage = await rootDoc.embedPage(pdfDoc.getPage(k));
          if (shipment.carrier === CARRIERS.UPS) {
            page.drawPage(embededPage, {
              x: 30,
              y: 0,
              width: fileSize[1],
              height: fileSize[0]
            });
          } else {
            page.drawPage(embededPage, {
              x: 0,
              y: 0,
              width: fileSize[0],
              height: fileSize[1]
            });
          }
        }
      } else if (labelFormat === 'PNG') {
        // eslint-disable-next-line no-await-in-loop
        const image = await rootDoc.embedPng(label.labelData);
        const page =
          shipment.carrier === CARRIERS.UPS || isUSPSIntl
            ? rootDoc.addPage([fileSize[1], fileSize[0]])
            : rootDoc.addPage([fileSize[0], fileSize[1]]);
        if (shipment.carrier === CARRIERS.UPS) {
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
      const pdfDoc = await PDFDocument.load(form.formData);
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
